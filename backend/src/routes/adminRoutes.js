import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../config/prisma.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { slugify } from '../utils/slugify.js';
import { uploadImage, deleteImage } from '../services/storageService.js';

const router = express.Router();
router.use(authenticate);
router.use(requireAdmin);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
    }
    cb(null, true);
  },
});

router.get('/dashboard', async (_req, res) => {
  try {
    const [artworks, featured, categories, subcategories, messages] = await Promise.all([
      prisma.artwork.count(),
      prisma.artwork.count({ where: { featured: true } }),
      prisma.category.count(),
      prisma.subcategory.count(),
      prisma.contactMessage.count(),
    ]);

    const recentArtworks = await prisma.artwork.findMany({
      include: { category: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });

    return successResponse(res, { data: { totalArtworks: artworks, featuredArtworks: featured, categories, subcategories, messages, recentArtworks, recentMessages } });
  } catch (error) {
    return errorResponse(res, 'Unable to load dashboard data.', 500);
  }
});

router.get('/artworks', async (req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      include: { category: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, { data: artworks });
  } catch (error) {
    return errorResponse(res, 'Unable to load artworks.', 500);
  }
});

router.post('/artworks', upload.single('image'), async (req, res) => {
  try {
    const { title, description, categoryId, subcategoryId, year, medium, dimensions, price, availability, featured } = req.body;

    if (!title || !description || !categoryId || !year || !medium || !dimensions) {
      return errorResponse(res, 'Required artwork fields are missing.', 400);
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return errorResponse(res, 'Invalid category.', 400);

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
      if (!subcategory) return errorResponse(res, 'Invalid subcategory.', 400);
    }

    let imageInfo = null;
    if (req.file) {
      imageInfo = await uploadImage(req.file);
    }

    if (!imageInfo) return errorResponse(res, 'Artwork image is required.', 400);

    const item = await prisma.artwork.create({
      data: {
        title,
        slug: slugify(title),
        description,
        imageUrl: imageInfo.url,
        imagePublicId: imageInfo.publicId,
        year: Number(year),
        medium,
        dimensions,
        price: price ? Number(price) : null,
        availability: availability || 'Available',
        featured: featured === 'true' || featured === true,
        categoryId,
        subcategoryId: subcategory ? subcategory.id : null,
      },
      include: { category: true, subcategory: true },
    });

    return successResponse(res, { data: item, message: 'Artwork created.' }, 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Unable to create artwork.', 500);
  }
});

router.put('/artworks/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) return errorResponse(res, 'Artwork not found.', 404);

    const update = {
      title: req.body.title ?? artwork.title,
      description: req.body.description ?? artwork.description,
      year: req.body.year ? Number(req.body.year) : artwork.year,
      medium: req.body.medium ?? artwork.medium,
      dimensions: req.body.dimensions ?? artwork.dimensions,
      price: req.body.price !== undefined && req.body.price !== null ? Number(req.body.price) : artwork.price,
      availability: req.body.availability ?? artwork.availability,
      featured: req.body.featured === 'true' || req.body.featured === true ? true : false,
      categoryId: req.body.categoryId ?? artwork.categoryId,
      subcategoryId: req.body.subcategoryId ?? artwork.subcategoryId,
    };

    if (req.file) {
      const imageInfo = await uploadImage(req.file);
      await deleteImage(artwork.imagePublicId);
      update.imageUrl = imageInfo.url;
      update.imagePublicId = imageInfo.publicId;
    }

    const updated = await prisma.artwork.update({ where: { id }, data: { ...update, slug: slugify(update.title) }, include: { category: true, subcategory: true } });
    return successResponse(res, { data: updated, message: 'Artwork updated.' });
  } catch (error) {
    return errorResponse(res, error.message || 'Unable to update artwork.', 500);
  }
});

router.delete('/artworks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) return errorResponse(res, 'Artwork not found.', 404);

    await deleteImage(artwork.imagePublicId);
    await prisma.artwork.delete({ where: { id } });

    return successResponse(res, { message: 'Artwork deleted.' });
  } catch (error) {
    return errorResponse(res, 'Unable to delete artwork.', 500);
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { subcategories: true }, orderBy: { name: 'asc' } });
    return successResponse(res, { data: categories });
  } catch (error) {
    return errorResponse(res, 'Unable to load categories.', 500);
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return errorResponse(res, 'Category name is required.', 400);

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        description,
      },
    });
    return successResponse(res, { data: category, message: 'Category created.' }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create category.', 500);
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description, slug: slugify(name) },
    });
    return successResponse(res, { data: category, message: 'Category updated.' });
  } catch (error) {
    return errorResponse(res, 'Unable to update category.', 500);
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id }, include: { artworks: true } });
    if (!category) return errorResponse(res, 'Category not found.', 404);
    if (category.artworks.length > 0) return errorResponse(res, 'Cannot delete a category that still contains artwork.', 400);

    await prisma.category.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Category deleted.' });
  } catch (error) {
    return errorResponse(res, 'Unable to delete category.', 500);
  }
});

router.post('/subcategories', async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    if (!name || !categoryId) return errorResponse(res, 'Category and name are required.', 400);

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return errorResponse(res, 'Invalid category.', 400);

    const subcategory = await prisma.subcategory.create({
      data: { name, slug: slugify(name), categoryId, description },
    });

    return successResponse(res, { data: subcategory, message: 'Subcategory created.' }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create subcategory.', 500);
  }
});

router.put('/subcategories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const subcategory = await prisma.subcategory.update({
      where: { id: req.params.id },
      data: { name, description, slug: slugify(name) },
    });
    return successResponse(res, { data: subcategory, message: 'Subcategory updated.' });
  } catch (error) {
    return errorResponse(res, 'Unable to update subcategory.', 500);
  }
});

router.delete('/subcategories/:id', async (req, res) => {
  try {
    const subcategory = await prisma.subcategory.findUnique({ where: { id: req.params.id }, include: { artworks: true } });
    if (!subcategory) return errorResponse(res, 'Subcategory not found.', 404);
    if (subcategory.artworks.length > 0) return errorResponse(res, 'Cannot delete a subcategory that still contains artwork.', 400);

    await prisma.subcategory.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Subcategory deleted.' });
  } catch (error) {
    return errorResponse(res, 'Unable to delete subcategory.', 500);
  }
});

router.get('/messages', async (_req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    return successResponse(res, { data: messages });
  } catch (error) {
    return errorResponse(res, 'Unable to load messages.', 500);
  }
});

router.patch('/messages/:id', async (req, res) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status: req.body.status || 'new' },
    });
    return successResponse(res, { data: message, message: 'Message updated.' });
  } catch (error) {
    return errorResponse(res, 'Unable to update message.', 500);
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    return successResponse(res, { message: 'Message deleted.' });
  } catch (error) {
    return errorResponse(res, 'Unable to delete message.', 500);
  }
});

export default router;
