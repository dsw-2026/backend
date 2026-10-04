import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors/app.error.js'
import { verifyToken } from '../utils/jwt.js'

// Authentication middleware: verifies there is a valid session.
// The token travels in an httpOnly cookie ('auth.token').
function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.['auth.token']

  if (!token) {
    throw new UnauthorizedError('Token no proporcionado')
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado')
  }
}

export { authenticate }