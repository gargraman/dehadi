# ============================================================================
# HireConnect - Multi-stage Docker Build
# ============================================================================
# Optimized for both development and production environments
# Supports hot-reload in development, optimized builds in production
# ============================================================================

# ----------------------------------------------------------------------------
# Stage 1: Base Image with Dependencies
# ----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install system dependencies required for node-gyp and native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# ----------------------------------------------------------------------------
# Stage 2: Development Dependencies
# ----------------------------------------------------------------------------
FROM base AS deps-dev

# Install all dependencies (including devDependencies)
# Use package-lock.json if present for reproducible installs.
# The previous command `npm clean install` was invalid and caused build failures.
RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# ----------------------------------------------------------------------------
# Stage 3: Production Dependencies
# ----------------------------------------------------------------------------
FROM base AS deps-prod

# Install only production dependencies (omit dev) using lock file if available
RUN if [ -f package-lock.json ]; then \
        npm ci --omit=dev; \
    else \
        npm install --omit=dev; \
    fi && \
    npm cache clean --force

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
# This creates dist/client (frontend) and dist/index.js (backend)
RUN npm run build

# ----------------------------------------------------------------------------
# Stage 5: Development Image
# ----------------------------------------------------------------------------
FROM base AS development

# Set environment to development
ENV NODE_ENV=development

# Copy all dependencies
COPY --from=deps-dev /app/node_modules ./node_modules

# Copy configuration files
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY drizzle.config.ts ./

# Copy source code (will be overridden by volume mounts in docker-compose)
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY db ./db

# Expose application port
EXPOSE 5000

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start development server with hot-reload
CMD ["npm", "run", "dev"]

# ----------------------------------------------------------------------------
# Stage 6: Production Image
# ----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps-prod /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY shared ./shared
COPY drizzle.config.ts ./

# Copy package.json for metadata
COPY package*.json ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 5000

# Health check for production
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start production server
CMD ["node", "dist/index.js"]
