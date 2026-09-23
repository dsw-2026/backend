import type { Request, Response, NextFunction } from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationError } from '../errors/app.error.js'

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(DtoClass, req.body)
    const errores = await validate(dtoInstance, {
      whitelist: true, 
    })
    if (errores.length > 0) {
      const detalles = errores.flatMap((e) => Object.values(e.constraints ?? {}))
      throw new ValidationError('Datos de entrada inválidos', detalles)
    }
    req.body.sanitizedInput = dtoInstance
    next()
  }
}