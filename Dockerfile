# Build stage
FROM node:20.18.1-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# ============================================
# Production Stage - Secure Debian Slim
# ============================================
FROM node:20.18.1-slim

WORKDIR /app

# Install runtime dependencies and security updates
RUN apt-get update && apt-get install -y \
    dumb-init \
    curl \
    ca-certificates \
    openssl \
    && apt-get upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy built application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN groupadd -r nodejs --gid=1001 && \
    useradd -r -g nodejs --uid=1001 --create-home --shell /bin/bash nestjs && \
    chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]