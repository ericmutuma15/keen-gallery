import express from 'express';
import prisma from '../config/prisma.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { slugify } from '../utils/slugify.js';

const router = express.Router();

router.get('/artworks', async (req, res) => {
  try {
    const { category, subcategory, featured, year, page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (category) where.category = { slug: category };
    if (subcategory) where.subcategory = { slug: subcategory };
    if (featured === 'true') where.featured = true;
    if (year) where.year = Number(year);

    const [items, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: { category: true, subcategory: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.artwork.count({ where })
    ]);

    return successResponse(res, { data: items, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) || 1, total });
  } catch (error) {
    return errorResponse(res, 'Unable to load artworks.', 500);
  }
});

router.get('/artworks/featured', async (_req, res) => {
  try {
    const items = await prisma.artwork.findMany({
      where: { featured: true },
      include: { category: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, 'Unable to load featured artworks.', 500);
  }
});

router.get('/artworks/:id', async (req, res) => {
  try {
    const item = await prisma.artwork.findUnique({
      where: { slug: req.params.id },
      include: { category: true, subcategory: true },
    });
    if (!item) return errorResponse(res, 'Artwork not found.', 404);

    const related = await prisma.artwork.findMany({
      where: {
        categoryId: item.categoryId,
        NOT: { id: item.id },
      },
      take: 4,
      include: { category: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { data: { ...item, related } });
  } catch (error) {
    return errorResponse(res, 'Unable to load artwork.', 500);
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' },
    });
    return successResponse(res, { data: categories });
  } catch (error) {
    return errorResponse(res, 'Unable to load categories.', 500);
  }
});

router.get('/categories/:id/subcategories', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { slug: req.params.id }, include: { subcategories: true } });
    if (!category) return errorResponse(res, 'Category not found.', 404);
    return successResponse(res, { data: category.subcategories });
  } catch (error) {
    return errorResponse(res, 'Unable to load subcategories.', 500);
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, inquiryType, message } = req.body;

    if (!name || !email || !subject || !inquiryType || !message) {
      return errorResponse(res, 'All required fields must be provided.', 400);
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        inquiryType,
        message,
      },
    });

    return successResponse(res, { data: newMessage, message: 'Your message has been sent.' }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to send message.', 500);
  }
});

export default router;
