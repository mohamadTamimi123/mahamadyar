#!/bin/bash

# Monitoring Script for Family Tree Application
# Usage: ./monitor.sh [interval-seconds]

set -e

INTERVAL=${1:-30}
PROJECT_DIR="/root/peligent"
COMPOSE_FILE="deploy/docker-compose.prod.yml"

echo "📊 Starting monitoring with $INTERVAL second intervals..."
echo "Press Ctrl+C to stop"

# Function to check service health
check_health() {
    local service=$1
    local url=$2
    local name=$3
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $name: OK"
        return 0
    else
        echo "❌ $name: FAILED"
        return 1
    fi
}

# Function to get container stats
get_stats() {
    echo "📈 Container Statistics:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" | head -5
}

# Function to check disk space
check_disk_space() {
    echo "💾 Disk Usage:"
    df -h / | tail -1 | awk '{print "Root: " $3 "/" $2 " (" $5 " used)"}'
    df -h /var/lib/docker | tail -1 | awk '{print "Docker: " $3 "/" $2 " (" $5 " used)"}' 2>/dev/null || echo "Docker: N/A"
}

# Function to check memory usage
check_memory() {
    echo "🧠 Memory Usage:"
    free -h | grep Mem | awk '{print "Total: " $2 ", Used: " $3 ", Free: " $4}'
}

# Main monitoring loop
while true; do
    clear
    echo "🕐 $(date)"
    echo "=========================================="
    
    # Health checks
    echo "🔍 Health Checks:"
    check_health "api" "http://localhost:5001/family-members" "API"
    check_health "ui" "http://localhost:3001" "UI"
    check_health "mailhog" "http://localhost:8025" "MailHog"
    
    # Database check
    if docker-compose -f "$COMPOSE_FILE" exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ Database: OK"
    else
        echo "❌ Database: FAILED"
    fi
    
    echo ""
    
    # System resources
    check_disk_space
    echo ""
    check_memory
    echo ""
    
    # Container stats
    get_stats
    echo ""
    
    # Container status
    echo "📋 Container Status:"
    docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "⏳ Next check in $INTERVAL seconds... (Press Ctrl+C to stop)"
    
    sleep "$INTERVAL"
done
