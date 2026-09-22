import type { Request, Response, NextFunction } from 'express'
import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from '../errors/app.error.js'
import { ApiErrorResponse } from '../errors/api.response.js'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  
  if (err instanceof AppError) {
    let statusCode = 500

    if (err instanceof ValidationError) statusCode = 400
    else if (err instanceof UnauthorizedError) statusCode = 401
    else if (err instanceof ForbiddenError) statusCode = 403
    else if (err instanceof NotFoundError) statusCode = 404
    else if (err instanceof ConflictError) statusCode = 409

    return res.status(statusCode).json(new ApiErrorResponse(err.message, err.details))
  }

  console.error('Error no controlado:', err)
  return res.status(500).json(new ApiErrorResponse('Error interno del servidor'))
}