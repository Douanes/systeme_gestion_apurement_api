#!/bin/bash
set -e

# Docker entrypoint script
# This script runs migrations before starting the application

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"; }
warning() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"; }

# Check if migrations should run
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"

if [ "$RUN_MIGRATIONS" = "true" ]; then
    log "🚀 Running database migrations..."

    # Wait for database to be ready
    log "⏳ Waiting for database to be ready..."
    max_attempts=30
    attempt=0

    until npx prisma db execute --schema=./prisma/schema.prisma --stdin <<< "SELECT 1;" 2>/dev/null || [ $attempt -eq $max_attempts ]; do
        attempt=$((attempt + 1))
        warning "Database not ready yet (attempt $attempt/$max_attempts)... waiting 2s"
        sleep 2
    done

    if [ $attempt -eq $max_attempts ]; then
        error "❌ Database connection timeout after $max_attempts attempts"
        exit 1
    fi

    log "✅ Database is ready!"

    # Run migrations
    log "📦 Deploying Prisma migrations..."
    if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
        log "✅ Migrations completed successfully"
    else
        error "❌ Migration deployment failed!"
        exit 1
    fi

    # Generate Prisma Client (in case schema changed)
    log "⚙️ Generating Prisma Client..."
    if npx prisma generate --schema=./prisma/schema.prisma; then
        log "✅ Prisma Client generated"
    else
        error "❌ Prisma Client generation failed!"
        exit 1
    fi
else
    warning "⏭️ Skipping migrations (RUN_MIGRATIONS=$RUN_MIGRATIONS)"
fi

# Start the application
log "🚀 Starting NestJS application..."
exec node dist/src/main.js
