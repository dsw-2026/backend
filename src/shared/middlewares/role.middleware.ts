import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors/app.error.js'

// Authorization middleware: restricts access by user type (role).
// Used AFTER authenticate (needs req.user already set).
function authorize(...allowedTypes: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedTypes.includes(req.user.type)) {
      throw new ForbiddenError('No tenés permisos para esta acción')
    }
    next()
  }
}

export { authorize }