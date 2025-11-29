# Build stage
FROM node:20.18.1 AS builder

WORKDIR /app

# Configure npm
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 10

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . .

# Build
RUN npm run build

# Verify build output
RUN ls -la dist/src/ && test -f dist/src/main.js

# Production stage
FROM node:20.18.1-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    dumb-init \
    curl \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Create non-root user
RUN groupadd -r nodejs --gid=1001 && \
    useradd -r -g nodejs --uid=1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]