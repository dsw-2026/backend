export class AppError extends Error {
  public readonly details?: unknown

  constructor(message: string, details?: unknown){
    super(message)
    this.name = this.constructor.name
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {}      // 404: recurso no encontrado
export class ValidationError extends AppError {}    // 400: datos inválidos
export class ConflictError extends AppError {}      // 409: conflicto (ej: duplicado, estado inválido)
export class UnauthorizedError extends AppError {}  // 401: no autenticado
export class ForbiddenError extends AppError {}     // 403: sin permisos
export class DatabaseError extends AppError {}      // 500: error de base de datos