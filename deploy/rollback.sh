#!/bin/bash

# Rollback Script for Family Tree Application
# Usage: ./rollback.sh [previous-commit-hash]

set -e

COMMIT_HASH=${1:-HEAD~1}
PROJECT_DIR="/root/peligent"
COMPOSE_FILE="deploy/docker-compose.prod.yml"

echo "🔄 Starting rollback to commit: $COMMIT_HASH"

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if commit exists
if ! git rev-parse --verify "$COMMIT_HASH" > /dev/null 2>&1; then
    echo "❌ Commit hash not found: $COMMIT_HASH"
    echo "Available recent commits:"
    git log --oneline -10
    exit 1
fi

# Show current and target commits
echo "📍 Current commit: $(git rev-parse --short HEAD)"
echo "🎯 Target commit: $(git rev-parse --short $COMMIT_HASH)"

# Confirm rollback
read -p "Are you sure you want to rollback? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down || true

# Rollback to previous commit
echo "🔄 Rolling back to commit: $COMMIT_HASH"
git reset --hard "$COMMIT_HASH"

# Pull images for the rolled back version
echo "📦 Pulling Docker images for rolled back version..."
docker-compose -f "$COMPOSE_FILE" pull

# Start services
echo "🚀 Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🔍 Running health checks..."

# Check API
if curl -f -s http://localhost:5001/family-members > /dev/null; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
    docker-compose -f "$COMPOSE_FILE" logs api
    exit 1
fi

# Check UI
if curl -f -s http://localhost:3001 > /dev/null; then
    echo "✅ UI health check passed"
else
    echo "❌ UI health check failed"
    docker-compose -f "$COMPOSE_FILE" logs ui
    exit 1
fi

echo "🎉 Rollback completed successfully!"
echo "📍 Current commit: $(git rev-parse --short HEAD)"
echo "🌐 Application is available at:"
echo "   - UI: http://localhost:3001"
echo "   - API: http://localhost:5001"
echo "   - MailHog: http://localhost:8025"
echo "   - Database: localhost:5025"
