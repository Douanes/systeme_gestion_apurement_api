#!/bin/bash
set -euo pipefail

# Script pour exécuter les migrations Prisma de manière sécurisée
# Usage: ./migrate.sh [environment]

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"; }
warning() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"; }

# Configuration
ENVIRONMENT="${1:-production}"
BACKUP_DIR="/opt/apurement/backups/migrations"
MIGRATION_LOG="/opt/apurement/logs/migrations.log"

# Create directories
mkdir -p "$(dirname "$MIGRATION_LOG")" "$BACKUP_DIR"

# Function to check database connection
check_database() {
    log "🔍 Checking database connection..."

    if [ -z "${DATABASE_URL:-}" ]; then
        error "DATABASE_URL is not set"
        return 1
    fi

    # Test connection using Prisma
    if npx prisma db execute --schema=./prisma/schema.prisma --stdin <<< "SELECT 1;" 2>/dev/null; then
        log "✅ Database connection successful"
        return 0
    else
        error "❌ Cannot connect to database"
        return 1
    fi
}

# Function to backup database before migration
backup_database() {
    log "💾 Creating database backup before migration..."

    local backup_file="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

    # Extract database details from DATABASE_URL
    # Format: postgresql://user:pass@host:port/database
    local db_url="${DATABASE_URL}"
    local db_host=$(echo "$db_url" | sed -n 's|.*@\([^:]*\):.*|\1|p')
    local db_port=$(echo "$db_url" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
    local db_name=$(echo "$db_url" | sed -n 's|.*/\([^?]*\).*|\1|p')
    local db_user=$(echo "$db_url" | sed -n 's|.*://\([^:]*\):.*|\1|p')
    local db_pass=$(echo "$db_url" | sed -n 's|.*://[^:]*:\([^@]*\)@.*|\1|p')

    if command -v pg_dump &> /dev/null; then
        export PGPASSWORD="$db_pass"
        if pg_dump -h "$db_host" -p "$db_port" -U "$db_user" "$db_name" > "$backup_file" 2>/dev/null; then
            log "✅ Backup created: $backup_file"

            # Compress backup
            gzip "$backup_file"
            log "✅ Backup compressed: ${backup_file}.gz"

            # Keep only last 10 backups
            ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm -f

            return 0
        else
            warning "⚠️ Could not create backup (pg_dump failed)"
            return 1
        fi
    else
        warning "⚠️ pg_dump not available, skipping backup"
        return 1
    fi
}

# Function to get current migration status
check_migration_status() {
    log "📊 Checking current migration status..."

    npx prisma migrate status --schema=./prisma/schema.prisma 2>&1 | tee -a "$MIGRATION_LOG"

    local status=$?
    if [ $status -eq 0 ]; then
        log "✅ Migration status checked successfully"
    else
        warning "⚠️ Migration status check returned non-zero exit code"
    fi

    return 0
}

# Function to deploy migrations
deploy_migrations() {
    log "🚀 Deploying Prisma migrations..."

    # Deploy migrations
    if npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 | tee -a "$MIGRATION_LOG"; then
        log "✅ Migrations deployed successfully"
        return 0
    else
        error "❌ Migration deployment failed"
        return 1
    fi
}

# Function to generate Prisma Client
generate_client() {
    log "⚙️ Generating Prisma Client..."

    if npx prisma generate --schema=./prisma/schema.prisma 2>&1 | tee -a "$MIGRATION_LOG"; then
        log "✅ Prisma Client generated successfully"
        return 0
    else
        error "❌ Prisma Client generation failed"
        return 1
    fi
}

# Main migration process
main() {
    log "🎬 Starting migration process for environment: $ENVIRONMENT"
    log "📍 Working directory: $(pwd)"
    log "📝 Migration log: $MIGRATION_LOG"

    # Check if we're in the right directory
    if [ ! -f "prisma/schema.prisma" ]; then
        error "prisma/schema.prisma not found. Are you in the correct directory?"
        return 1
    fi

    # Check database connection
    if ! check_database; then
        error "Database connection check failed"
        return 1
    fi

    # Check current migration status
    check_migration_status

    # Create backup (non-fatal if it fails)
    backup_database || warning "Continuing without backup..."

    # Deploy migrations
    if ! deploy_migrations; then
        error "Migration deployment failed!"
        error "Please check the logs at: $MIGRATION_LOG"
        return 1
    fi

    # Generate Prisma Client
    if ! generate_client; then
        error "Prisma Client generation failed!"
        return 1
    fi

    log "✅ Migration process completed successfully!"
    log ""
    log "📊 Final migration status:"
    npx prisma migrate status --schema=./prisma/schema.prisma

    return 0
}

# Error handling
trap 'error "Migration process failed!"; exit 1' ERR

# Run main process
if main; then
    log "🎉 All migrations applied successfully!"
    exit 0
else
    error "💥 Migration process failed"
    exit 1
fi
