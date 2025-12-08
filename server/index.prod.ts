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

const app = express();

// Fast health check endpoint - responds immediately without any middleware
app.get('/health', (_req, res) => {
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
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find the build directory: ${distPath}`);
  }

  expressApp.use(express.static(distPath));
  expressApp.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  try {
    await ready;
    logger.info('Database connection established');

    await seed();
    
    const dependencies = createProductionDependencies();

    setupAuthentication(app, dependencies.storage);
    logger.info('Authentication system initialized');

    app.use('/api/auth', createAuthRoutes(dependencies.storage));
    logger.info('Authentication routes registered');

    const server = await registerRoutes(app, dependencies);
    logger.info('Application routes registered');

    // Serve static files in production
    serveStatic(app);

    app.use(notFoundHandler);
    app.use(errorHandler);

    const port = parseInt(process.env.PORT || '5000', 10);
    const host = '0.0.0.0';
    
    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error('Server error', { error: err.message, code: err.code });
      process.exit(1);
    });

    server.listen(port, host, () => {
      logger.info(`Server started successfully`, { port, host, environment: 'production' });
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
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
