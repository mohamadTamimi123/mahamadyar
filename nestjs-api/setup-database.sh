#!/bin/bash

# Database Setup Script for NestJS + TypeORM + PostgreSQL

echo "Setting up PostgreSQL database for NestJS application..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "On CentOS/RHEL: sudo yum install postgresql-server postgresql-contrib"
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Check if PostgreSQL service is running
if ! systemctl is-active --quiet postgresql; then
    echo "Starting PostgreSQL service..."
    sudo systemctl start postgresql
fi

# Create database
echo "Creating database 'nestjs_db'..."
sudo -u postgres psql -c "CREATE DATABASE nestjs_db;"

echo "Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy env.example to .env and update the database credentials"
echo "2. Run: npm run start:dev"
