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
- Docker and Docker Compose
- Postgres database (via Docker Compose in this repo)
- npm

## Development

1. Start the Postgres database with Docker Compose (see below)
2. Configure the NestJS API `.env` to connect to Postgres
3. Start the NestJS API server
4. Start the Next.js development server
5. Open the frontend in your browser and navigate to the users page

## Database with Docker Compose (Postgres)

This repository includes a minimal Docker Compose file to run Postgres for local development and future containerization of the stack.

### Setup

1. Copy `.env.example` to `.env` and adjust credentials if needed:

```bash
cp .env.example .env
```

2. Start the database:

```bash
docker compose up -d
```

This will:
- Start a Postgres 15 instance
- Expose port `5432` by default
- Persist data in a named Docker volume `mohamadyar_postgres_data`
- Run any SQL files under `docker/init` on first startup

3. Check container health:

```bash
docker compose ps
```

4. Connect using `psql`:

```bash
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
```

### Environment variables

See `.env.example` for the following variables:

- `DB_HOST` (default `localhost`)
- `DB_PORT` (default `5432`)
- `DB_USER` (default `postgres`)
- `DB_PASSWORD` (default `postgres`)
- `DB_NAME` (default `mohamadyar`)

You can also define `DATABASE_URL` if your tools prefer a single URL.

## Production Deployment

Both applications can be deployed independently:
- Deploy the NestJS API to your preferred hosting service
- Deploy the Next.js frontend to Vercel, Netlify, or any other hosting service
- Update the API URL in the frontend configuration
