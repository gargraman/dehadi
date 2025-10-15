import { Request, Response, NextFunction, Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { IStorage } from '../storage';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';
import { logger } from '../lib/logger';

/**
 * Extended Request interface with authenticated user
 * Augment Express Request to include our user type
 */
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      role: string;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

/**
 * Setup Passport.js authentication strategy
 */
export function setupAuthentication(app: Express, storage: IStorage) {
  // Configure Local Strategy for username/password authentication
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        logger.debug('Authentication attempt', { username });

        // Find user by username
        const user = await storage.getUserByUsername(username);
        if (!user) {
          logger.warn('Authentication failed - user not found', { username });
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Check if user has a password hash
        if (!user.passwordHash) {
          logger.error('User has no password hash', { userId: user.id });
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          logger.warn('Authentication failed - invalid password', { username });
          return done(null, false, { message: 'Invalid username or password' });
        }

        logger.info('Authentication successful', { userId: user.id, username });

        // Return user object (will be stored in session)
        return done(null, {
          id: user.id,
          username: user.username,
          role: user.role
        });
      } catch (error) {
        logger.error('Authentication error', { error, username });
        return done(error);
      }
    }
  ));

  // Serialize user for session storage
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, {
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      logger.error('Deserialization error', { error, userId: id });
      done(error);
    }
  });

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  logger.info('Passport authentication configured');
}

/**
 * Middleware to ensure user is authenticated
 * Use this to protect routes that require login
 */
export function ensureAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  logger.warn('Unauthenticated access attempt', {
    path: req.path,
    method: req.method
  });

  next(new UnauthorizedError('Authentication required'));
}

/**
 * Middleware to ensure user has one of the specified roles
 * Use this after ensureAuthenticated for role-based access control
 *
 * @example
 * app.post('/api/jobs', ensureAuthenticated, ensureRole('employer'), handler);
 */
export function ensureRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.error('ensureRole called without authenticated user');
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path
      });

      return next(new ForbiddenError(
        `Access denied. Required role: ${allowedRoles.join(' or ')}`
      ));
    }

    next();
  };
}

/**
 * Optional authentication middleware
 * Attaches user to request if authenticated, but doesn't require it
 * Useful for endpoints that have different behavior for authenticated users
 */
export function optionalAuthentication(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // User is already attached by passport if authenticated
  next();
}
