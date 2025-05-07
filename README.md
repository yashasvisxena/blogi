# Blog App

Live Demo: [https://blogi-beta.vercel.app/](https://blogi-beta.vercel.app/)

Docs : [docs](https://docs.google.com/document/d/1UjovmzLO3hEGw7VZEMJu2aG_-w4JrzOHuWhXVPuCif0/edit?usp=sharing)

A modern blog application built with Next.js, featuring authentication, post creation, and image uploads.

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Image upload support using Cloudinary
- Responsive design
- Dark/Light mode support
- Search and filter posts
- Pagination
- Sort posts by date, title, etc.

## Tech Stack

- Next.js 15.3.1
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Neon DB)
- Cloudinary
- JWT Authentication

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose (for containerized setup)
- Neon DB account (for database)
- Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Neon DB)
DATABASE_URL="your_neon_database_url"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

For Docker deployment, these environment variables will be automatically passed to the container from your `.env` file.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Setup

1. Build and start the container:

```bash
docker-compose up --build
```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

3. To stop the container:

```bash
docker-compose down
```

## Database Migrations

To run database migrations:

```bash
npx prisma migrate dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Blog Posts

- `GET /api/blogs` - Get all posts (with pagination, search, and filters)
- `GET /api/blog/:id` - Get a single post
- `POST /api/blog` - Create a new post
- `PUT /api/blog/:id` - Update a post
- `DELETE /api/blog/:id` - Delete a post

### Upload

- `POST /api/upload` - Upload an image to Cloudinary

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Neon DB Documentation](https://neon.tech/docs)

## License

This project is licensed under the MIT License.
