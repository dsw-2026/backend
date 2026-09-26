import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'
import { ValidationError } from '../errors/app.error.js'

// Middleware fábrica: recibe un schema de Zod y devuelve un middleware que
// valida el req.body contra ese schema.
// - safeParse valida sin lanzar excepción: devuelve { success, data } o { success, error }.
// - Si falla, lanza un ValidationError (que el errorHandler convierte en 400)
//   con la lista de campos que no cumplieron.
// - Si pasa, guarda los datos ya validados (y con el tipo correcto) en
//   req.body.validated para que el controller los use.
export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const details = result.error.issues.map((issue) => issue.message)
      throw new ValidationError('Invalid input data', details)
    }

    req.body.validated = result.data
    next()
  }
}