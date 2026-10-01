import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors/app.error.js'

function verificarTipo(...tiposPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !tiposPermitidos.includes(req.usuario.tipo)) {
      throw new ForbiddenError('No tenés permisos para esta acción')
    }
    next()
  }
}

export { verificarTipo }