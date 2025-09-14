# Full-Stack Application: Next.js + NestJS + TypeORM

This project consists of a complete full-stack application with:
- **Backend**: NestJS API with TypeORM and MySQL
- **Frontend**: Next.js application with TypeScript and Tailwind CSS

## Project Structure

```
mohamadYar/
├── nestjs-api/          # NestJS backend with TypeORM
└── nextjs-frontend/     # Next.js frontend
```

## Quick Start

### 1. Backend Setup (NestJS)

```bash
cd nestjs-api

# Install dependencies
npm install

# Create .env file with database configuration
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=your_password
# DB_DATABASE=nestjs_db

# Start the API server
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 2. Frontend Setup (Next.js)

```bash
cd nextjs-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## Features

### Backend (NestJS)
- RESTful API with CRUD operations
- TypeORM integration with MySQL
- User entity with validation
- Environment configuration
- TypeScript support

### Frontend (Next.js)
- Modern React with Next.js 14
- User management interface
- API integration
- Responsive design with Tailwind CSS
- TypeScript support

## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

## Database Schema

The application uses a simple User entity with the following fields:
- `id` (Primary Key)
- `email` (Unique)
- `name`
- `phone` (Optional)
- `createdAt`
- `updatedAt`

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm

## Development

1. Start the MySQL database
2. Create a database named `nestjs_db`
3. Start the NestJS API server
4. Start the Next.js development server
5. Open the frontend in your browser and navigate to the users page

## Production Deployment

Both applications can be deployed independently:
- Deploy the NestJS API to your preferred hosting service
- Deploy the Next.js frontend to Vercel, Netlify, or any other hosting service
- Update the API URL in the frontend configuration
