import {
  UniqueConstraintViolationException,
  ForeignKeyConstraintViolationException,
  NotNullConstraintViolationException,
} from '@mikro-orm/core'
import { ConflictError, DatabaseError } from './app.error.js'

export function mapDbError(error: unknown): never {
  if (error instanceof UniqueConstraintViolationException) {
    throw new ConflictError ('Ya existe un registro con esos datos únicos')
  }
  if (error instanceof ForeignKeyConstraintViolationException) {
    throw new ConflictError('No se puede completar la acción: hay registros relacionados')
  }
  if (error instanceof NotNullConstraintViolationException){
    throw new DatabaseError('Falta un dato obligatorio')
  }
  throw new DatabaseError('Error en la base de datos')
}