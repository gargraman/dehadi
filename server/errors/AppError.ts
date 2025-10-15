/**
 * Base application error class for custom error handling
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - Validation or business rule errors
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

/**
 * 401 Unauthorized - Authentication required
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message);
  }
}

/**
 * 403 Forbidden - Insufficient permissions
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(403, message);
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

/**
 * 409 Conflict - Resource already exists
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

/**
 * 400 Bad Request - Business rule violation
 */
export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

/**
 * 503 Service Unavailable - External service error
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(503, `${service} error: ${message}`);
  }
}
