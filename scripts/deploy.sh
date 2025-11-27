#!/bin/bash
set -euo pipefail

# Configuration
APP_DIR="/opt/apurement"
COMPOSE_FILE="$APP_DIR/docker-compose.apurement.yml"
ENV_FILE="$APP_DIR/.env"
BACKUP_DIR="$APP_DIR/backups"
LOG_FILE="$APP_DIR/deployment.log"
SERVICE_NAME="apurement-api"
NETWORK_NAME="apurement-network"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"; }
warning() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"; }

# Check if Docker network exists
check_network() {
    if ! docker network ls | grep -q "${NETWORK_NAME}"; then
        log "📡 Creating network: $NETWORK_NAME"
        docker network create "$NETWORK_NAME"
    else
        log "✅ Network $NETWORK_NAME exists"
    fi
}

# Save current state
save_state() {
    log "💾 Saving current state..."
    mkdir -p "$BACKUP_DIR"
    
    CURRENT_IMAGE=$(docker inspect "$SERVICE_NAME" --format='{{.Config.Image}}' 2>/dev/null || echo "none")
    CURRENT_ID=$(docker ps -aqf "name=^${SERVICE_NAME}$" 2>/dev/null | head -1 || echo "none")
    
    # Use proper quoting to avoid issues
    cat > "$BACKUP_DIR/last_deployment.state" << EOF
PREVIOUS_IMAGE="${CURRENT_IMAGE}"
PREVIOUS_CONTAINER_ID="${CURRENT_ID}"
DEPLOYMENT_TIME="$(date -Iseconds)"
IMAGE_TAG="${IMAGE_TAG:-latest}"
GIT_COMMIT="${GIT_COMMIT:-unknown}"
EOF
    
    log "✅ State saved: $CURRENT_IMAGE"
}

# Check container health
check_health() {
    local max_attempts=30
    local attempt=0
    
    log "🏥 Checking container health..."
    
    while [ $attempt -lt $max_attempts ]; do
        # Check if container is running
        if docker ps --filter "name=^${SERVICE_NAME}$" --format "{{.Status}}" | grep -q "Up"; then
            # Try health endpoint
            if curl -sf http://localhost:3100/health > /dev/null 2>&1; then
                log "✅ Health check passed (attempt $((attempt + 1)))"
                return 0
            fi
        fi
        
        attempt=$((attempt + 1))
        info "⏳ Waiting for service... ($attempt/$max_attempts)"
        sleep 3
    done
    
    error "❌ Health check failed after $max_attempts attempts"
    if docker ps -a --filter "name=^${SERVICE_NAME}$" --format "{{.Names}}" | grep -q "$SERVICE_NAME"; then
        docker logs "$SERVICE_NAME" --tail 100
    fi
    return 1
}

# Rollback function
rollback() {
    error "🔴 DEPLOYMENT FAILED - Initiating rollback..."
    
    # Stop and remove failed container
    docker stop "$SERVICE_NAME" 2>/dev/null || true
    docker rm "$SERVICE_NAME" 2>/dev/null || true
    
    if [ ! -f "$BACKUP_DIR/last_deployment.state" ]; then
        error "No backup state found. Cannot rollback."
        return 1
    fi
    
    # Load previous state
    source "$BACKUP_DIR/last_deployment.state"
    
    if [ "$PREVIOUS_IMAGE" == "none" ] || [ -z "$PREVIOUS_IMAGE" ]; then
        warning "No previous deployment found. Cannot rollback."
        return 1
    fi
    
    log "📦 Rolling back to: $PREVIOUS_IMAGE"
    
    # Extract version from previous image
    export APUREMENT_VERSION=$(echo "$PREVIOUS_IMAGE" | cut -d':' -f2)
    
    # Start previous version
    docker compose -f "$COMPOSE_FILE" up -d
    
    # Wait and verify
    sleep 15
    if check_health; then
        log "✅ Rollback successful!"
        return 0
    else
        error "❌ Rollback failed - manual intervention required"
        return 1
    fi
}

# Main deployment
main() {
    log "🚀 Starting deployment for $SERVICE_NAME..."
    log "📊 Configuration:"
    log "   - Image: babaly/apurement-api:${IMAGE_TAG:-latest}"
    log "   - Directory: $APP_DIR"
    log "   - Compose File: $COMPOSE_FILE"
    log "   - Port: 3100"
    
    # Create directories
    mkdir -p "$APP_DIR" "$BACKUP_DIR"
    cd "$APP_DIR"
    
    # Check prerequisites
    check_network
    
    # Save current state
    save_state
    
    # Login to Docker Hub
    if [ -n "${DOCKER_PASSWORD:-}" ]; then
        log "🔐 Logging into Docker Hub..."
        echo "$DOCKER_PASSWORD" | docker login -u "${DOCKER_USERNAME}" --password-stdin
    fi
    
    # Download latest compose file
    log "📥 Downloading latest docker-compose configuration..."
    if [ -n "${GITHUB_REPOSITORY:-}" ]; then
        if curl -fsSL "https://raw.githubusercontent.com/$GITHUB_REPOSITORY/main/docker/docker-compose.apurement.yml" -o "$COMPOSE_FILE"; then
            log "✅ Downloaded docker-compose file"
        else
            warning "Could not download compose file, using existing one"
        fi
    fi
    
    # Verify compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Compose file not found: $COMPOSE_FILE"
        return 1
    fi
    
    # Load environment variables
    if [ -f "$ENV_FILE" ]; then
        set -a
        source "$ENV_FILE"
        set +a
        log "✅ Loaded environment variables"
    else
        error ".env file not found: $ENV_FILE"
        return 1
    fi
    
    # Set version for compose
    export APUREMENT_VERSION="${IMAGE_TAG:-latest}"
    
    # Update version in .env
    if grep -q "^APUREMENT_VERSION=" "$ENV_FILE"; then
        sed -i "s/^APUREMENT_VERSION=.*/APUREMENT_VERSION=${IMAGE_TAG:-latest}/" "$ENV_FILE"
    else
        echo "APUREMENT_VERSION=${IMAGE_TAG:-latest}" >> "$ENV_FILE"
    fi
    
    # Pull new image
    NEW_IMAGE="babaly/apurement-api:${IMAGE_TAG:-latest}"
    log "📥 Pulling new image: $NEW_IMAGE"
    
    if ! docker pull "$NEW_IMAGE"; then
        error "Failed to pull image"
        return 1
    fi
    
    # Stop old container if exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${SERVICE_NAME}$"; then
        log "🛑 Stopping old container..."
        docker stop "$SERVICE_NAME" 2>/dev/null || true
        docker rm "$SERVICE_NAME" 2>/dev/null || true
    fi
    
    # Deploy with docker compose
    log "🚀 Starting new container with docker compose..."
    docker compose -f "$COMPOSE_FILE" up -d
    
    # Wait for container to start
    log "⏳ Waiting for container to initialize..."
    sleep 15
    
    # Final health check
    if ! check_health; then
        error "Final health check failed"
        docker logs "$SERVICE_NAME" --tail 100 || true
        rollback
        return 1
    fi
    
    # Verify response
    log "🔌 Verifying API response..."
    HEALTH_RESPONSE=$(curl -sf http://localhost:3100/health 2>/dev/null || echo "failed")
    if echo "$HEALTH_RESPONSE" | grep -q "ok\|healthy\|status"; then
        log "✅ API is responding correctly"
    else
        warning "⚠️ Unexpected health check response: $HEALTH_RESPONSE"
    fi
    
    # Cleanup old images (keep last 3)
    log "🧹 Cleaning up old images..."
    docker images "babaly/apurement-api" --format "{{.ID}} {{.CreatedAt}}" \
        | sort -rk 2 \
        | tail -n +4 \
        | awk '{print $1}' \
        | xargs -r docker rmi -f 2>/dev/null || true
    
    # Success
    log "✅ Deployment completed successfully!"
    log "📊 Current status:"
    docker ps --filter "name=$SERVICE_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    log ""
    log "🌐 Access your API:"
    log "   - Local: http://localhost:3100/health"
    log "   - Public: https://api-apurement.ameenaltech.com/health"
    
    return 0
}

# Trap errors
trap 'rollback' ERR

# Run deployment
if main; then
    log "🎉 All done!"
    exit 0
else
    error "💥 Deployment failed"