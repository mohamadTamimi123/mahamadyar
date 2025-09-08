# Family Tree API

A NestJS API for managing family tree data with PostgreSQL database.

## Features

- RESTful API for family members CRUD operations
- PostgreSQL database with TypeORM
- Family tree visualization endpoints
- Data import from JSON files
- Parent-child relationships

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example and modify as needed
cp .env.example .env
```

3. Configure database connection in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=family_tree
```

4. Start PostgreSQL and create database:
```sql
CREATE DATABASE family_tree;
```

### Running the Application

1. Start in development mode:
```bash
npm run start:dev
```

2. Import data from JSON files:
```bash
npm run import:data
```

3. Build for production:
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Family Members

- `GET /family-members` - Get all family members
- `GET /family-members/tree` - Get family tree structure
- `GET /family-members/:id` - Get specific family member
- `GET /family-members/father/:fatherName` - Get children of specific father
- `POST /family-members` - Create new family member
- `PUT /family-members/:id` - Update family member
- `DELETE /family-members/:id` - Delete family member
- `POST /family-members/import` - Import data from JSON

### Example Usage

```bash
# Get all family members
curl http://localhost:3000/family-members

# Get family tree
curl http://localhost:3000/family-members/tree

# Create new family member
curl -X POST http://localhost:3000/family-members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "fatherName": "Jane Doe",
    "birth": "1990-01-01",
    "residence": "New York"
  }'
```

## Data Structure

```typescript
interface FamilyMember {
  id: number;
  blockId: number;
  sourceFile: string;
  name: string;
  fatherName: string;
  childrenCount: number;
  children: string[];
  birth: string;
  residence: string;
  death: boolean;
  fatherId: number;
  father: FamilyMember;
  childrenMembers: FamilyMember[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run import:data` - Import data from JSON files

### Project Structure

```
src/
├── config/           # Configuration files
├── entities/         # TypeORM entities
├── scripts/          # Utility scripts
├── family-member.controller.ts
├── family-member.service.ts
├── family-member.module.ts
└── main.ts
```

## Database Schema

The application uses PostgreSQL with the following main table:

- `family_members` - Stores family member data with relationships

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.