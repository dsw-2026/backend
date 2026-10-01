import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../errors/app.error.js'
import { verifyToken } from '../utils/jwt.js'
import type { TokenPayload } from '../types/auth.types.js'   

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload
    }
  }
}

function verificarToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.['auth.token']

  if (!token) {
    throw new UnauthorizedError('Token no proporcionado')
  }

  try {
    const payload = verifyToken(token)
    req.usuario = payload
    next()
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado')
  }
}

export { verificarToken }