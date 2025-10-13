# Multi-stage Dockerfile for Dehadi.co.in Worker Marketplace Platform
# Optimized for both local development and production deployment

# ============================================================================
# Stage 1: Build Frontend (Vite)
# ============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy frontend source code
COPY client ./client
COPY shared ./shared
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./

# Build frontend
RUN npm run build

# ============================================================================
# Stage 2: Build Backend (Express)
# ============================================================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy backend source code
COPY server ./server
COPY shared ./shared
COPY tsconfig.json ./

# Build backend with esbuild
RUN npm run build

# ============================================================================
# Stage 3: Production Image
# ============================================================================
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy built backend from backend-builder stage
COPY --from=backend-builder /app/dist/index.js ./dist/

# Copy necessary runtime files
COPY shared ./shared
COPY drizzle.config.ts ./

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app files
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 5000 (standard for this application)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
