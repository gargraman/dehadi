import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createProductionDependencies } from "./dependencies";
import { setupAuthentication } from "./middleware/auth.middleware";
import { createAuthRoutes } from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { logger, requestLogger } from "./lib/logger";
import { pool, ready } from "./db";
import { seed } from "../db/seed";

const app = express();

// Fast health check endpoint - responds immediately without any middleware
// This MUST be before any other middleware to ensure quick response for load balancers
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logging
app.use(requestLogger);

// Session configuration
const PgSession = connectPgSimple(session);
const sessionSecret = process.env.SESSION_SECRET;

// Validate session secret in production
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    logger.error('SESSION_SECRET not set in production - server will not start');
    throw new Error('SESSION_SECRET environment variable must be set in production');
  }
  logger.warn('SESSION_SECRET not set - using insecure default (development only)');
}

app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: sessionSecret || 'dev-only-insecure-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    sameSite: 'lax', // Required for cross-origin requests in Replit proxy environment
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

(async () => {
  // Ensure database driver/client initialized before proceeding
  await ready;
  try {
    // Seed database with initial data (idempotent - only seeds if empty)
    await seed();
    
    const dependencies = createProductionDependencies();

    // Setup authentication with Passport
    setupAuthentication(app, dependencies.storage);
    logger.info('Authentication system initialized');

    // Register authentication routes
    app.use('/api/auth', createAuthRoutes(dependencies.storage));
    logger.info('Authentication routes registered');

    // Register application routes
    const server = await registerRoutes(app, dependencies);
    logger.info('Application routes registered');

    // Setup Vite in development, serve static in production
    // This must be before 404 handler so UI routes are handled by Vite
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // 404 handler for unmatched routes (must be after all API routes and Vite setup)
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    // Start server - always bind to 0.0.0.0 for cloud environments
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = '0.0.0.0';
    
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`, { port, host });
      } else if (err.code === 'EACCES') {
        logger.error(`Permission denied to bind to port ${port}`, { port, host });
      } else {
        logger.error('Server error occurred', { error: err.message, code: err.code });
      }
      process.exit(1);
    });

    server.listen(port, host, () => {
      logger.info(`Server started successfully`, {
        port,
        host,
        environment: process.env.NODE_ENV || 'development'
      });
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error('Failed to start server', { 
      error: errorMessage, 
      stack: errorStack,
      env: process.env.NODE_ENV 
    });
    process.exit(1);
  }
})();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
  process.exit(1);
});
