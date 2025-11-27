#!/bin/bash
set -e

echo "🚀 Installing Traefik (won't affect existing services)..."

# Check if Traefik is already running
if docker ps | grep -q "traefik"; then
    echo "✅ Traefik is already running!"
    exit 0
fi

# Check if apurement-network exists
if ! docker network ls | grep -q "apurement-network"; then
    echo "📡 Creating network: apurement-network"
    docker network create apurement-network
fi

# Create Traefik directory
mkdir -p /opt/traefik/letsencrypt
chmod 600 /opt/traefik/letsencrypt

# Create Traefik compose file
cat > /opt/traefik/docker-compose.yml << 'EOF'
version: '3.9'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    command:
      - "--api.dashboard=true"
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=apurement-network"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@ameenaltech.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--log.level=INFO"
      - "--accesslog=true"
    ports:
      - "80:80"
      - "443:443"
      - "8888:8080"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - apurement-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.ameenaltech.com`)"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"
      - "traefik.http.routers.traefik.service=api@internal"

networks:
  apurement-network:
    external: true
EOF

# Start Traefik
cd /opt/traefik
docker-compose up -d

echo "✅ Traefik installed successfully!"
echo "🌐 Dashboard: https://traefik.ameenaltech.com"
echo ""
echo "Note: Make sure DNS records point to this server:"
echo "  - traefik.ameenaltech.com → $(curl -s ifconfig.me)"
echo "  - api-apurement.ameenaltech.com → $(curl -s ifconfig.me)"