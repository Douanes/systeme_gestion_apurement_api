#!/bin/bash
set -e

echo "🚀 Setting up Apurement API deployment..."

# Configuration
APP_DIR="/opt/apurement"
SERVER_USER="${USER}"

# Create directories
echo "📁 Creating directories..."
sudo mkdir -p "$APP_DIR"
sudo chown "$SERVER_USER:$SERVER_USER" "$APP_DIR"
cd "$APP_DIR"

mkdir -p backups docker traefik/letsencrypt

# Create .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Apurement API Version
APUREMENT_VERSION=latest

# Supabase Database
APUREMENT_DATABASE_URL=postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
APUREMENT_DIRECT_URL=postgresql://postgres:password@db.xxx.supabase.com:5432/postgres

# Security
JWT_SECRET=change-this-to-a-secure-random-string

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=xxx;AccountKey=xxx;EndpointSuffix=core.windows.net
AZURE_APUREMENT_STORAGE_CONTAINER_NAME=apurement-documents

# Traefik
TRAEFIK_DATA_DIR=/opt/apurement/traefik
EOF
    echo "⚠️  Please edit .env file with your actual credentials!"
    echo "   nano $APP_DIR/.env"
else
    echo "✅ .env file already exists"
fi

# Create docker network
echo "📡 Creating Docker network..."
docker network create apurement-network 2>/dev/null || echo "Network already exists"

# Test Nginx configuration
echo "🔍 Checking Nginx configuration..."
if ! sudo nginx -t; then
    echo "❌ Nginx configuration has errors. Please fix before continuing."
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit environment variables: nano $APP_DIR/.env"
echo "2. Configure DNS: api-apurement.ameenaltech.com → $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo "3. Get SSL certificate: sudo certbot --nginx -d api-apurement.ameenaltech.com"
echo "4. Deploy: Run GitHub Actions or manually: cd $APP_DIR && docker-compose -f docker-compose.apurement.yml up -d"