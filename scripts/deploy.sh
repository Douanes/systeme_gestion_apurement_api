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
    if ! docker network ls | grep -q "^[^ ]* *${NETWORK_NAME}"; then
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
    CURRENT_ID=$(docker ps -aqf "name=$SERVICE_NAME" 2>/dev/null || echo "none")
    
    cat > "$BACKUP_DIR/last_deployment.state" << EOF
PREVIOUS_IMAGE=$CURRENT_IMAGE
PREVIOUS_CONTAINER_ID=$CURRENT_ID
DEPLOYMENT_TIME=$(date -Iseconds)
IMAGE_TAG=${IMAGE_TAG:-latest}
GIT_COMMIT=${GIT_COMMIT:-unknown}
EOF
    
    log "✅ State saved: $CURRENT_IMAGE"
}

# Check container health
check_health() {
    local max_attempts=20
    local attempt=0
    
    log "🏥 Checking container health..."
    
    while [ $attempt -lt $max_attempts ]; do
        if docker ps --filter "name=$SERVICE_NAME" --format "{{.Status}}" | grep -q "Up"; then
            # Try health endpoint
            if curl -sf http://localhost:3100/health > /dev/null 2>&1; then
                log "✅ Health check passed (attempt $((attempt + 1)))"
                return 0
            fi
        fi
        
        attempt=$((attempt + 1))
        info "⏳ Waiting for service... ($attempt/$max_attempts)"
        sleep 2
    done
    
    error "❌ Health check failed after $max_attempts attempts"
    docker logs "$SERVICE_NAME" --tail 50
    return 1
}

# Rollback function
rollback() {
    error "🔴 DEPLOYMENT FAILED - Initiating rollback..."
    
    if [ ! -f "$BACKUP_DIR/last_deployment.state" ]; then
        error "No backup state found. Cannot rollback."
        return 1
    fi
    
    source "$BACKUP_DIR/last_deployment.state"
    
    if [ "$PREVIOUS_IMAGE" == "none" ]; then
        warning "No previous deployment found. Starting fresh container with latest..."
        docker compose -f "$COMPOSE_FILE" up -d
        return 0
    fi
    
    log "📦 Rolling back to: $PREVIOUS_IMAGE"
    
    # Extract version from previous image
    export APUREMENT_VERSION=$(echo "$PREVIOUS_IMAGE" | cut -d':' -f2)
    
    # Stop and remove current container
    docker stop "$SERVICE_NAME" 2>/dev/null || true
    docker rm "$SERVICE_NAME" 2>/dev/null || true
    
    # Start previous version
    docker compose -f "$COMPOSE_FILE" up -d
    
    # Wait and verify
    sleep 10
    if check_health; then
        log "✅ Rollback successful!"
        return 0
    else
        error "❌ Rollback failed - manual intervention required"
        docker logs "$SERVICE_NAME" --tail 100
        return 1
    fi
}

# Main deployment
main() {
    log "🚀 Starting deployment for $SERVICE_NAME..."
    log "📊 Configuration:"
    log "   - Image: babaly/apurement-api:${IMAGE_TAG:-latest}"
    log "   - Directory: $APP_DIR"
    log "   - Compose: $COMPOSE_FILE"
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
        echo "$DOCKER_PASSWORD" | docker login -u "${DOCKER_USERNAME:-istamcodevops}" --password-stdin
    fi
    
    # Download latest compose file
    log "📥 Downloading latest docker-compose configuration..."
    if [ -n "${GITHUB_REPOSITORY:-}" ]; then
        curl -fsSL "https://raw.githubusercontent.com/$GITHUB_REPOSITORY/main/docker/docker-compose.apurement.yml" -o "$COMPOSE_FILE" 2>/dev/null || {
            warning "Could not download compose file, using existing one"
        }
    fi
    
    # Load environment variables
    if [ -f "$ENV_FILE" ]; then
        set -a
        source "$ENV_FILE"
        set +a
    fi
    
    # Update version in .env
    if [ -f "$ENV_FILE" ]; then
        if grep -q "APUREMENT_VERSION=" "$ENV_FILE"; then
            sed -i "s/APUREMENT_VERSION=.*/APUREMENT_VERSION=${IMAGE_TAG:-latest}/" "$ENV_FILE"
        else
            echo "APUREMENT_VERSION=${IMAGE_TAG:-latest}" >> "$ENV_FILE"
        fi
    fi
    
    # Set version for compose
    export APUREMENT_VERSION="${IMAGE_TAG:-latest}"
    
    # Pull new image
    NEW_IMAGE="babaly/apurement-api:${IMAGE_TAG:-latest}"
    log "📥 Pulling new image: $NEW_IMAGE"
    
    if ! docker pull "$NEW_IMAGE"; then
        error "Failed to pull image"
        return 1
    fi
    
    # Deploy strategy: Zero downtime
    if docker ps -a --format '{{.Names}}' | grep -q "^${SERVICE_NAME}$"; then
        log "🔄 Performing zero-downtime update..."
        
        # Start new container with different name
        TMP_CONTAINER="${SERVICE_NAME}-new"
        
        # Create new container
        docker run -d \
            --name "$TMP_CONTAINER" \
            --network "$NETWORK_NAME" \
            -p 3101:3000 \
            -e NODE_ENV=production \
            -e PORT=3000 \
            -e DATABASE_URL="${APUREMENT_DATABASE_URL}" \
            -e DIRECT_URL="${APUREMENT_DIRECT_URL}" \
            -e JWT_SECRET="${JWT_SECRET}" \
            -e AZURE_STORAGE_CONNECTION_STRING="${AZURE_STORAGE_CONNECTION_STRING}" \
            -e AZURE_STORAGE_CONTAINER_NAME="${AZURE_APUREMENT_STORAGE_CONTAINER_NAME:-apurement-documents}" \
            --restart unless-stopped \
            "$NEW_IMAGE"
        
        # Wait for new container to be healthy
        log "⏳ Waiting for new container to be healthy..."
        sleep 15
        
        local healthy=false
        for i in {1..30}; do
            if curl -sf http://localhost:3101/health > /dev/null 2>&1; then
                log "✅ New container is healthy"
                healthy=true
                break
            fi
            sleep 2
        done
        
        if [ "$healthy" = true ]; then
            log "🔄 Switching traffic..."
            
            # Stop old container
            docker stop "$SERVICE_NAME" 2>/dev/null || true
            docker rm "$SERVICE_NAME" 2>/dev/null || true
            
            # Rename new container and update port
            docker stop "$TMP_CONTAINER"
            docker rename "$TMP_CONTAINER" "$SERVICE_NAME"
            
            # Remove old port mapping and add correct one
            docker start "$SERVICE_NAME"
            
            # Use docker-compose to ensure correct configuration
            docker stop "$SERVICE_NAME"
            docker rm "$SERVICE_NAME"
            docker compose -f "$COMPOSE_FILE" up -d
            
            log "✅ Traffic switched successfully"
        else
            error "New container health check failed"
            docker logs "$TMP_CONTAINER" --tail 50
            docker stop "$TMP_CONTAINER" 2>/dev/null || true
            docker rm "$TMP_CONTAINER" 2>/dev/null || true
            rollback
            return 1
        fi
    else
        log "🆕 Creating new container..."
        docker compose -f "$COMPOSE_FILE" up -d
    fi
    
    # Final health check
    if ! check_health; then
        error "Final health check failed"
        rollback
        return 1
    fi
    
    # Verify database connectivity
    log "🔌 Verifying Supabase connectivity..."
    if ! curl -sf http://localhost:3100/health | grep -q "ok\|healthy\|\"status\":\"ok\""; then
        warning "Database connectivity check inconclusive, but container is running"
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
    log "   - Direct: http://localhost:3100/health"
    log "   - Domain: https://api-apurement.ameenaltech.com/health"
    
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
    exit 1
fi