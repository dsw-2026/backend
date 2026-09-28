import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, ForbiddenError } from '../shared/errors/app.error.js'

export interface TokenPayload {
  id: number
  tipo: string // 'Publisher' | 'Adopter' | 'Admin'
}

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
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
    req.usuario = payload
    next()
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado')
  }
}

function verificarTipo(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo)) {
      throw new ForbiddenError('No tenés permisos para esta acción')
    }
    next()
  }
}

export { verificarToken, verificarTipo }