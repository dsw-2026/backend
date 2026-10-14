export class AppError extends Error {
  public readonly details?: unknown

  constructor(message: string, details?: unknown){
    super(message)
    this.name = this.constructor.name
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

//Error Subclasses
export class NotFoundError extends AppError {}      // 404: Resource not found
export class ValidationError extends AppError {}    // 400: Invalid payload or parameters
export class ConflictError extends AppError {}      // 409: Conflict (e.g., duplicate entry, invalid state transition
export class UnauthorizedError extends AppError {}  // 401: Authentication required or invalid token
export class ForbiddenError extends AppError {}     // 403: Insufficient permissions
export class DatabaseError extends AppError {}      // 500: Internal database or persistence error