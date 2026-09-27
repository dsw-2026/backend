import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'
import { ValidationError } from '../errors/app.error.js'

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path[issue.path.length - 1] ?? 'unknown',
        message: issue.message,
      }))
      throw new ValidationError('Datos de entrada inválidos', details)
    }

    const data = result.data as { body?: unknown; params?: unknown; query?: unknown }
    if (data.body !== undefined) req.body = data.body
    if (data.params !== undefined) req.params = data.params as any
    if (data.query !== undefined) req.query = data.query as any

    next()
  }
}