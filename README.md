# Artist Gallery

A production-style full-stack artist portfolio and gallery application for showcasing artwork and managing admin operations.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express + Prisma + PostgreSQL
- Auth: JWT + bcrypt + setup tokens + allowlist admin access
- Storage: Cloudinary-ready abstraction with local fallback for development
- Email: Nodemailer

## Features

- Premium public gallery landing page and artwork browsing
- Category and subcategory filtering
- Artwork detail pages and featured gallery sections
- Contact form with backend validation
- Protected `/admin` flow with allowlisted emails and setup token verification
- Dashboard for artwork, categories, and contact messages
- Prisma schema with seeded data and migration-ready structure
- Production-minded API and security layer

## Setup

1. Install dependencies in each app
2. Create `.env` files using the provided examples
3. Run Prisma migrations
4. Seed the database
5. Start backend and frontend

## Run

```bash
npm install --prefix frontend
npm install --prefix backend
npm run db:migrate
npm run db:seed
npm run dev:backend
npm run dev:frontend
```

## Admin setup

The initial authorized admin email is:

```text
eriqmutuma@gmail.com
```

The user can visit `/admin` and request access. If their email is allowlisted, they receive an email with a setup link to create their account password.

## Notes

This project is structured for local development and extension to cloud storage and production deployment.
