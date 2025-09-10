#!/bin/bash

# Manual Deployment Script
# Run this on the server to deploy the latest version

set -e

PROJECT_DIR="/root/peligent"
REPO_URL="https://github.com/mohamadTamimi123/mahamadyar.git"

echo "🚀 Starting manual deployment..."

# Navigate to project directory
cd "$PROJECT_DIR" || {
    echo "❌ Project directory not found: $PROJECT_DIR"
    echo "Creating directory..."
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
}

# Check if it's a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git remote add origin "$REPO_URL"
else
    echo "📁 Git repository found"
fi

# Check remote configuration
echo "🔗 Remote configuration:"
git remote -v

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "none")
echo "📍 Current branch: $CURRENT_BRANCH"

# Switch to main branch and update
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git checkout -B main origin/main
else
    echo "🔄 Updating main branch..."
    git reset --hard origin/main
fi

# Show latest commits
echo "📊 Latest commits:"
git log --oneline -5

# Check if docker-compose file exists
if [ ! -f "deploy/docker-compose.prod.yml" ]; then
    echo "❌ Docker compose file not found!"
    exit 1
fi

# Set environment variables
export POSTGRES_DB=family_tree
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=your_secure_password_here
export JWT_SECRET=your_jwt_secret_here
export JWT_EXPIRES_IN=24h
export EMAIL_FROM=noreply@familytree.com
export NEXT_PUBLIC_API_BASE_URL=http://localhost:5001

echo "🔧 Environment variables set"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f deploy/docker-compose.prod.yml down || true

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker compose -f deploy/docker-compose.prod.yml pull

# Start services
echo "🚀 Starting services..."
docker compose -f deploy/docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🔍 Running health checks..."
for i in {1..5}; do
    echo "Health check attempt $i/5..."
    if curl -f -s http://localhost:5001/family-members > /dev/null && curl -f -s http://localhost:3001 > /dev/null; then
        echo "✅ Health checks passed!"
        break
    else
        echo "⚠️ Health check failed, retrying..."
        sleep 10
    fi
    
    if [ "$i" -eq 5 ]; then
        echo "❌ Health checks failed after 5 attempts"
        echo "📋 Container status:"
        docker compose -f deploy/docker-compose.prod.yml ps
        echo "📋 Container logs:"
        docker compose -f deploy/docker-compose.prod.yml logs --tail=20
        exit 1
    fi
done

# Show running containers
echo "📊 Running containers:"
docker compose -f deploy/docker-compose.prod.yml ps

echo "🎉 Manual deployment completed successfully!"
echo "🌐 Application is available at:"
echo "   - UI: http://localhost:3001"
echo "   - API: http://localhost:5001"
echo "   - MailHog: http://localhost:8025"
