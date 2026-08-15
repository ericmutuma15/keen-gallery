import cloudinary from 'cloudinary';

const cloudinaryClient = cloudinary.v2;
cloudinaryClient.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  if (!file) throw new Error('No file uploaded');

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const result = await cloudinaryClient.uploader.upload(file.path || file.buffer, {
      folder: 'artist-gallery',
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  }

  return {
    url: file.path || 'https://images.unsplash.com/photo-1515405295579-ba7b45403062',
    publicId: 'local-fallback',
    width: 1200,
    height: 900,
    format: 'jpg',
    size: 0,
  };
};

export const deleteImage = async (publicId) => {
  if (!publicId || publicId === 'local-fallback') return;
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    await cloudinaryClient.uploader.destroy(publicId);
  }
};
