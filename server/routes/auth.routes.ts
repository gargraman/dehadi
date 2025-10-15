import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { IStorage } from '../storage';
import { ensureAuthenticated, AuthenticatedRequest } from '../middleware/auth.middleware';
import { ConflictError, ValidationError } from '../errors/AppError';
import { logger } from '../lib/logger';

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  role: z.enum(['worker', 'employer', 'ngo']),
  fullName: z.string().min(1).max(200),
  phone: z.string().min(10).max(15),
  language: z.string().optional().default('en'),
  location: z.string().optional(),
  skills: z.string().optional(),
  aadhar: z.string().optional()
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

/**
 * Create authentication routes
 */
export function createAuthRoutes(storage: IStorage): Router {
  const router = Router();

  /**
   * POST /api/auth/register
   * Register a new user
   */
  router.post('/register', async (req, res, next) => {
    try {
      // Validate request body
      const userData = registerSchema.parse(req.body);

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        throw new ConflictError('Username already taken');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        username: userData.username,
        passwordHash,
        fullName: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        language: userData.language,
        location: userData.location || null,
        skills: userData.skills ? [userData.skills] : null, // Convert string to array
        aadhar: userData.aadhar || null
      });

      logger.info('User registered', {
        userId: user.id,
        username: user.username,
        role: user.role
      });

      // Return user data (without password hash)
      res.status(201).json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        language: user.language
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /api/auth/login
   * Login with username and password
   */
  router.post('/login', (req, res, next) => {
    try {
      // Validate request body
      loginSchema.parse(req.body);
    } catch (error) {
      return next(error);
    }

    // Authenticate using Passport
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        logger.error('Login error', { error: err });
        return next(err);
      }

      if (!user) {
        logger.warn('Login failed', { reason: info?.message });
        return res.status(401).json({
          status: 'error',
          message: info?.message || 'Invalid credentials'
        });
      }

      // Establish session
      req.logIn(user, (err) => {
        if (err) {
          logger.error('Session creation error', { error: err, userId: user.id });
          return next(err);
        }

        logger.info('User logged in', { userId: user.id, username: user.username });

        res.json({
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          },
          message: 'Login successful'
        });
      });
    })(req, res, next);
  });

  /**
   * POST /api/auth/logout
   * Logout current user
   */
  router.post('/logout', ensureAuthenticated, (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?.id;
    const username = req.user?.username;

    req.logout((err) => {
      if (err) {
        logger.error('Logout error', { error: err, userId });
        return next(err);
      }

      logger.info('User logged out', { userId, username });

      res.json({
        message: 'Logout successful'
      });
    });
  });

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  router.get('/me', ensureAuthenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) {
        throw new Error('User not found in request');
      }

      // Fetch full user details from storage
      const user = await storage.getUser(req.user.id);
      if (!user) {
        throw new Error('User not found in database');
      }

      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        language: user.language,
        location: user.location,
        skills: user.skills
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/auth/status
   * Check authentication status (public endpoint)
   */
  router.get('/status', (req: AuthenticatedRequest, res) => {
    res.json({
      authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      user: req.user || null
    });
  });

  return router;
}
