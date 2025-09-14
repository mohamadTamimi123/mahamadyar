# NestJS API with TypeORM

This is a NestJS application with TypeORM integration for MySQL database.

## Features

- NestJS framework
- TypeORM for database operations
- MySQL database support
- User entity with CRUD operations
- Environment configuration
- TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nestjs_db
NODE_ENV=development
PORT=3000
```

3. Create the database in MySQL:
```sql
CREATE DATABASE nestjs_db;
```

## Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── app.controller.ts      # Main controller
├── app.service.ts         # Main service
├── user.entity.ts         # User entity definition
├── user.module.ts         # User module
├── user.controller.ts     # User controller
├── user.service.ts        # User service
└── main.ts               # Application entry point
```