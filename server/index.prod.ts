// Production-only server entry point - no Vite dependencies
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes";
import { createProductionDependencies } from "./dependencies";
import { setupAuthentication } from "./middleware/auth.middleware";
import { createAuthRoutes } from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { logger, requestLogger } from "./lib/logger";
import { pool, ready } from "./db";
import { seed } from "../db/seed";

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  logger.error('Unhandled rejection', { reason: String(reason) });
});

const app = express();

// Logging middleware to see all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Fast health check endpoint - responds immediately without any middleware
app.get('/health', (_req, res) => {
  console.log('Health check hit');
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// CORS configuration for split frontend/backend deployment
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || [];

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  logger.warn('ALLOWED_ORIGINS not set in production - CORS will reject all cross-origin requests.');
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

// Session configuration
const PgSession = connectPgSimple(session);
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    logger.error('SESSION_SECRET not set in production');
    throw new Error('SESSION_SECRET environment variable must be set in production');
  }
  logger.warn('SESSION_SECRET not set - using insecure default');
}

const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: sessionSecret || 'dev-session-secret-at-least-32-chars-long',
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax',
  }
}));

// Static file serving for production
function serveStatic(expressApp: express.Express) {
  // Use fileURLToPath for ESM compatibility across Node.js versions
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  let distPath = path.resolve(currentDir, "public");

  console.log(`Looking for static files at: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`Static files not found at: ${distPath}`);
    // Try alternative path
    const altPath = path.resolve(process.cwd(), "dist", "public");
    console.log(`Trying alternative path: ${altPath}`);
    if (fs.existsSync(altPath)) {
      distPath = altPath;
    } else {
      throw new Error(`Could not find the build directory at ${distPath} or ${altPath}`);
    }
  }

  // Serve static files
  expressApp.use(express.static(distPath));
  
  // Catch-all for frontend routes ONLY (exclude /api and /health)
  expressApp.get("*", (req, res, next) => {
    // Skip API routes and health check
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  try {
    console.log('Starting server initialization...');
    await ready;
    console.log('Database ready');
    logger.info('Database connection established');

    await seed();
    console.log('Seeding complete');
    
    console.log('Creating dependencies...');
    const dependencies = createProductionDependencies();
    console.log('Dependencies created');

    console.log('Setting up authentication...');
    setupAuthentication(app, dependencies.storage);
    console.log('Authentication setup complete');
    logger.info('Authentication system initialized');

    console.log('Creating auth routes...');
    app.use('/api/auth', createAuthRoutes(dependencies.storage));
    console.log('Auth routes created');
    logger.info('Authentication routes registered');

    console.log('Registering application routes...');
    await registerRoutes(app, dependencies);
    console.log('Application routes registered');
    logger.info('Application routes registered');

    // Serve static files in production
    console.log('Setting up static file serving...');
    serveStatic(app);
    console.log('Static file serving setup complete');

    app.use(notFoundHandler);
    app.use(errorHandler);

    // Railway Docker deployments expect port 8080 by default
    // (Railway injects PORT env var, but default to 8080 for Docker compatibility)
    const port = parseInt(process.env.PORT || '8080', 10);
    const host = '0.0.0.0';
    
    console.log(`Attempting to listen on ${host}:${port}...`);
    
    // Use Express's listen directly instead of HTTP server
    const server = app.listen(port, host, () => {
      console.log(`Server listening on ${host}:${port}`);
      logger.info(`Server started successfully`, { port, host, environment: 'production' });
    });
    
    server.on('error', (err: NodeJS.ErrnoException) => {
      console.error('Server error:', err.message, err.code);
      logger.error('Server error', { error: err.message, code: err.code });
      process.exit(1);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to start server:', errorMessage);
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
})();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
  process.exit(1);
});
