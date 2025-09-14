#!/bin/bash

# Migration script for registration_code field
echo "Starting migration for registration_code field..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the nestjs-api directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the migration using psql if available, otherwise use Node.js
if command -v psql &> /dev/null; then
    echo "Using psql for migration..."
    # You'll need to set your database connection details
    echo "Please run the SQL migration manually:"
    echo "psql -h localhost -U postgres -d nestjs_db -f migration-add-registration-code.sql"
else
    echo "Using Node.js for migration..."
    npx ts-node migrate-registration-code.ts
fi

echo "Migration completed!"
