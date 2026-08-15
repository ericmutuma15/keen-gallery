import prisma from '../src/config/prisma.js';
import { slugify } from '../src/utils/slugify.js';

const seed = async () => {
  await prisma.contactMessage.deleteMany({});
  await prisma.artwork.deleteMany({});
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.adminSetupToken.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.adminAllowlist.deleteMany({});

  const adminAllowlist = await prisma.adminAllowlist.createMany({
    data: [{ email: 'eriqmutuma@gmail.com', isActive: true }],
  });

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Paintings', slug: 'paintings', description: 'Expressionist and abstract works' } }),
    prisma.category.create({ data: { name: 'Photography', slug: 'photography', description: 'Documentary and portrait studies' } }),
    prisma.category.create({ data: { name: 'Digital Art', slug: 'digital-art', description: 'Illustrative and conceptual digital pieces' } }),
    prisma.category.create({ data: { name: 'Sculpture', slug: 'sculpture', description: 'Material and mixed-media works' } }),
    prisma.category.create({ data: { name: 'Illustration', slug: 'illustration', description: 'Narrative and editorial illustration' } }),
  ]);

  const paintingSubs = await Promise.all([
    prisma.subcategory.create({ data: { name: 'Abstract', slug: 'abstract', categoryId: categories[0].id } }),
    prisma.subcategory.create({ data: { name: 'Portraits', slug: 'portraits', categoryId: categories[0].id } }),
    prisma.subcategory.create({ data: { name: 'Landscapes', slug: 'landscapes', categoryId: categories[0].id } }),
  ]);

  const photoSubs = await Promise.all([
    prisma.subcategory.create({ data: { name: 'Portrait', slug: 'portrait', categoryId: categories[1].id } }),
    prisma.subcategory.create({ data: { name: 'Nature', slug: 'nature', categoryId: categories[1].id } }),
    prisma.subcategory.create({ data: { name: 'Architecture', slug: 'architecture', categoryId: categories[1].id } }),
  ]);

  const digitalSubs = await Promise.all([
    prisma.subcategory.create({ data: { name: 'Illustrations', slug: 'illustrations', categoryId: categories[2].id } }),
    prisma.subcategory.create({ data: { name: 'Concept Art', slug: 'concept-art', categoryId: categories[2].id } }),
    prisma.subcategory.create({ data: { name: 'Digital Paintings', slug: 'digital-paintings', categoryId: categories[2].id } }),
  ]);

  const sculptureSubs = await Promise.all([
    prisma.subcategory.create({ data: { name: 'Wood', slug: 'wood', categoryId: categories[3].id } }),
    prisma.subcategory.create({ data: { name: 'Metal', slug: 'metal', categoryId: categories[3].id } }),
    prisma.subcategory.create({ data: { name: 'Mixed Media', slug: 'mixed-media', categoryId: categories[3].id } }),
  ]);

  const illustrationSubs = await Promise.all([
    prisma.subcategory.create({ data: { name: 'Editorial', slug: 'editorial', categoryId: categories[4].id } }),
    prisma.subcategory.create({ data: { name: 'Storytelling', slug: 'storytelling', categoryId: categories[4].id } }),
  ]);

  const artworks = [
    { title: 'Machakos Light', slug: 'machakos-light', categoryId: categories[0].id, subcategoryId: paintingSubs[1].id, imageUrl: '/assets/machakos-light.jpeg', year: 2026, medium: 'Digital portrait', dimensions: '90 x 120 cm', price: 2200, availability: 'Available', featured: true },
    { title: 'After Rain', slug: 'after-rain', categoryId: categories[0].id, subcategoryId: paintingSubs[0].id, imageUrl: '/assets/after-rain.jpeg', year: 2026, medium: 'Mixed media', dimensions: '100 x 80 cm', price: 2600, availability: 'Available', featured: true },
    { title: 'Night Market', categoryId: categories[1].id, subcategoryId: photoSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80', year: 2026, medium: 'Street editorial', dimensions: '80 x 60 cm', price: 1500, availability: 'Available', featured: true },
    { title: 'Commuter Echo', categoryId: categories[1].id, subcategoryId: photoSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80', year: 2026, medium: 'Photo collage', dimensions: '70 x 100 cm', price: 1300, availability: 'Available', featured: false },
    { title: 'Studio Silence', categoryId: categories[2].id, subcategoryId: digitalSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', year: 2026, medium: 'Digital composition', dimensions: '120 x 100 cm', price: 2700, availability: 'Available', featured: false },
    { title: 'Low Sun', categoryId: categories[2].id, subcategoryId: digitalSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', year: 2026, medium: 'Editorial portrait', dimensions: '90 x 125 cm', price: 1600, availability: 'Available', featured: false },
    { title: 'Silent Horizon', categoryId: categories[0].id, subcategoryId: paintingSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80', year: 2025, medium: 'Oil on linen', dimensions: '120 x 90 cm', price: 2800, availability: 'Available', featured: true },
    { title: 'Amber Drift', categoryId: categories[0].id, subcategoryId: paintingSubs[0].id, imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80', year: 2024, medium: 'Acrylic on canvas', dimensions: '100 x 80 cm', price: 2100, availability: 'Available', featured: true },
    { title: 'Glass Memory', categoryId: categories[0].id, subcategoryId: paintingSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80', year: 2023, medium: 'Mixed media', dimensions: '90 x 120 cm', price: 2400, availability: 'Sold', featured: false },
    { title: 'Velvet Study', categoryId: categories[1].id, subcategoryId: photoSubs[0].id, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80', year: 2025, medium: 'Photograph', dimensions: '70 x 100 cm', price: 1200, availability: 'Available', featured: true },
    { title: 'Stone & Light', categoryId: categories[1].id, subcategoryId: photoSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', year: 2024, medium: 'Photograph', dimensions: '80 x 60 cm', price: 900, availability: 'Available', featured: false },
    { title: 'Wild Tides', categoryId: categories[1].id, subcategoryId: photoSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', year: 2021, medium: 'Photograph', dimensions: '100 x 80 cm', price: 1100, availability: 'Available', featured: false },
    { title: 'Eclipse Bloom', categoryId: categories[2].id, subcategoryId: digitalSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', year: 2025, medium: 'Digital painting', dimensions: '140 x 100 cm', price: 3200, availability: 'Available', featured: true },
    { title: 'Night Circuit', categoryId: categories[2].id, subcategoryId: digitalSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80', year: 2024, medium: 'Concept art', dimensions: '120 x 80 cm', price: 2600, availability: 'Available', featured: false },
    { title: 'Fable Engine', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', year: 2022, medium: 'Illustration', dimensions: '110 x 75 cm', price: 1500, availability: 'Available', featured: false },
    { title: 'Nowhere Vessel', categoryId: categories[3].id, subcategoryId: sculptureSubs[2].id, imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80', year: 2023, medium: 'Mixed media sculpture', dimensions: '80 x 70 x 40 cm', price: 3400, availability: 'Available', featured: false },
    { title: 'Iron Bloom', categoryId: categories[3].id, subcategoryId: sculptureSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80', year: 2021, medium: 'Steel installation', dimensions: '150 x 65 x 65 cm', price: 4700, availability: 'Commissioned', featured: true },
    { title: 'Map of Drift', categoryId: categories[4].id, subcategoryId: illustrationSubs[0].id, imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', year: 2025, medium: 'Ink and digital', dimensions: '90 x 125 cm', price: 1400, availability: 'Available', featured: false },
    { title: 'Moonlit Notes', categoryId: categories[4].id, subcategoryId: illustrationSubs[1].id, imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80', year: 2024, medium: 'Digital illustration', dimensions: '100 x 70 cm', price: 1300, availability: 'Available', featured: false },
    { title: 'Hollow Echo', categoryId: categories[0].id, subcategoryId: paintingSubs[0].id, imageUrl: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?auto=format&fit=crop&w=1200&q=80', year: 2020, medium: 'Acrylic on panel', dimensions: '70 x 90 cm', price: 1700, availability: 'Sold', featured: false },
    // Local frontend asset images - theme-friendly names and unique slugs
    { title: 'Portrait Abstract', slug: 'portrait-abstract', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: '/assets/portrait-abstract.jpeg', year: 2026, medium: 'Digital', dimensions: '800 x 600 px', price: 0, availability: 'Available', featured: false },
    { title: 'Market Street', slug: 'market-street', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: '/assets/market-street.jpeg', year: 2026, medium: 'Digital', dimensions: '1200 x 800 px', price: 0, availability: 'Available', featured: false },
    { title: 'Studio Dawn', slug: 'studio-dawn', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: '/assets/studio-dawn.jpeg', year: 2026, medium: 'Digital', dimensions: '800 x 600 px', price: 0, availability: 'Available', featured: false },
    { title: 'Studio Dusk', slug: 'studio-dusk', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: '/assets/studio-dusk.jpeg', year: 2026, medium: 'Digital', dimensions: '800 x 600 px', price: 0, availability: 'Available', featured: false },
    { title: 'Edgar Keen Portrait', slug: 'edgar-keen-portrait', categoryId: categories[2].id, subcategoryId: digitalSubs[0].id, imageUrl: '/assets/edgar-keen-portrait.svg', year: 2026, medium: 'Vector', dimensions: '600 x 600 px', price: 0, availability: 'Available', featured: false },
  ];

  for (const artwork of artworks) {
    await prisma.artwork.create({
      data: {
        title: artwork.title,
        slug: artwork.slug ? artwork.slug : slugify(artwork.title),
        description: 'A contemplative collection piece exploring atmosphere, memory, and human rhythm.',
        imageUrl: artwork.imageUrl,
        year: artwork.year,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        price: artwork.price,
        availability: artwork.availability,
        featured: artwork.featured,
        categoryId: artwork.categoryId,
        subcategoryId: artwork.subcategoryId,
        imagePublicId: null,
      },
    });
  }

  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Jordan Hale',
        email: 'jordan@example.com',
        phone: '+123456789',
        subject: 'Private commission request',
        inquiryType: 'Commission',
        message: 'I would love to commission a portrait piece for a residence project.',
        status: 'new',
      },
      {
        name: 'Alex Reed',
        email: 'alex@example.com',
        subject: 'Exhibition possibilities',
        inquiryType: 'Exhibition',
        message: 'We are curating a new exhibition in the city and would love to discuss collaboration.',
        status: 'read',
      },
    ],
  });

  console.log('Seed complete');
};

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
