#!/bin/bash

# Deployment Script for Family Tree Application
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/root/peligent"
COMPOSE_FILE="docker-compose.yml"

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if git repository is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: Working directory has uncommitted changes"
fi

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git fetch origin
git reset --hard origin/main

# Check if docker-compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Docker compose file not found: $COMPOSE_FILE"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down || true

# Also stop any containers using the same ports
echo "🔍 Checking for port conflicts..."
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "(5025|1025|8025|5001|3001)" || true

# Force stop any conflicting containers
echo "🛑 Force stopping conflicting containers..."
docker stop $(docker ps -q --filter "publish=5025") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=1025") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=8025") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=5001") 2>/dev/null || true
docker stop $(docker ps -q --filter "publish=3001") 2>/dev/null || true

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose -f "$COMPOSE_FILE" pull

# Start services
echo "🚀 Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d

# Check if services started successfully
echo "🔍 Checking service status..."
docker-compose -f "$COMPOSE_FILE" ps

# If UI failed, try to start it separately
if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "deploy_ui_1.*Up"; then
    echo "⚠️ UI service failed to start, checking logs..."
    docker-compose -f "$COMPOSE_FILE" logs ui
    echo "🔄 Trying to restart UI service..."
    docker-compose -f "$COMPOSE_FILE" restart ui
    sleep 10
    docker-compose -f "$COMPOSE_FILE" ps
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🔍 Running health checks..."

# Check API
if curl -f -s http://localhost:5002/family-members > /dev/null; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
    docker-compose -f "$COMPOSE_FILE" logs api
    exit 1
fi

# Check UI
if curl -f -s http://localhost:3002 > /dev/null; then
    echo "✅ UI health check passed"
else
    echo "❌ UI health check failed"
    docker-compose -f "$COMPOSE_FILE" logs ui
    exit 1
fi

# Check database
if docker-compose -f "$COMPOSE_FILE" exec -T db pg_isready -U postgres > /dev/null; then
    echo "✅ Database health check passed"
else
    echo "❌ Database health check failed"
    docker-compose -f "$COMPOSE_FILE" logs db
    exit 1
fi

# Show running containers
echo "📊 Running containers:"
docker-compose -f "$COMPOSE_FILE" ps

# Show resource usage
echo "📈 Resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is available at:"
echo "   - UI: http://localhost:3002"
echo "   - API: http://localhost:5002"
echo "   - MailHog: http://localhost:8026"
echo "   - Database: localhost:5433"
