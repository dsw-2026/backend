import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { sanitizePublicadorInput, findAll, findOne, create, update, remove } from './publicador.controller.js'

export const publicadorRouter = Router()

// Lectura: por ahora pública. (definir si estos listados son funcionalidad pública o solo de Admin. Por exposicion de datos sensibles
publicadorRouter.get('/', findAll)
publicadorRouter.get('/:id', findOne)

// Alta: pública. Es el registro de un nuevo Publicador.
publicadorRouter.post('/', sanitizePublicadorInput, create)

// Edición y baja: el dueño de la cuenta, o un Admin (moderación de cuentas).
publicadorRouter.put('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), sanitizePublicadorInput, update)
publicadorRouter.patch('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), sanitizePublicadorInput, update)
publicadorRouter.delete('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), remove)