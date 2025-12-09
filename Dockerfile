# ============================================================================
# HireConnect - Multi-stage Docker Build
# ============================================================================
# Optimized for both development and production environments
# Uses glibc-based image to avoid Rollup musl binary issues
# ============================================================================

# ----------------------------------------------------------------------------
# Stage 1: Base Image with Dependencies
# ----------------------------------------------------------------------------
FROM node:20-bullseye-slim AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# ----------------------------------------------------------------------------
# Stage 2: Development Dependencies
# ----------------------------------------------------------------------------
FROM base AS deps-dev

# Install all dependencies (including devDependencies)
RUN npm ci || npm install

# ----------------------------------------------------------------------------
# Stage 3: Production Dependencies
# ----------------------------------------------------------------------------
FROM base AS deps-prod

# Install only production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# ----------------------------------------------------------------------------
# Stage 4: Builder - Build Application
# ----------------------------------------------------------------------------
FROM deps-dev AS builder

# Copy configuration files
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY drizzle.config.ts ./

# Copy source code
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY db ./db

# Build frontend and backend
RUN npm run build

# ----------------------------------------------------------------------------
# Stage 5: Development Image
# ----------------------------------------------------------------------------
FROM base AS development

ENV NODE_ENV=development

COPY --from=deps-dev /app/node_modules ./node_modules

COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY drizzle.config.ts ./

COPY client ./client
COPY server ./server
COPY shared ./shared
COPY db ./db

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

CMD ["npm", "run", "dev"]

# ----------------------------------------------------------------------------
# Stage 6: Production Image
# ----------------------------------------------------------------------------
FROM node:20-bullseye-slim AS production

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy production dependencies only (prod entry point has no Vite references)
COPY --from=deps-prod /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY package*.json ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=30s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Run the production server
CMD ["node", "dist/index.js"]
