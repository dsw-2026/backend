import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { sanitizeAdoptanteInput, findAll, findOne, create, update, remove } from './adoptante.controller.js'

export const adoptanteRouter = Router()

// Listado completo de adoptantes: solo Admin. 
adoptanteRouter.get('/', verificarToken, verificarTipo('Admin'), findAll)

// Ficha de UN adoptante: además del propio dueño y del Admin, la puede ver
// un Publicador — pero solo si ese adoptante le mandó una solicitud por
// alguna de SUS mascotas. esto ultimo se revisa en el controller
adoptanteRouter.get('/:id', verificarToken, verificarTipo('Adoptante', 'Publicador', 'Admin'), findOne)

// Alta: pública. Es el registro de un nuevo Adoptante.
adoptanteRouter.post('/', sanitizeAdoptanteInput, create)

// Edición y baja: el dueño de la cuenta, o un Admin (moderación de
// cuentas). Que el :id de la URL sea el del usuario logueado se valida
// adentro del controller.
adoptanteRouter.put('/:id', verificarToken, verificarTipo('Adoptante', 'Admin'), sanitizeAdoptanteInput, update)
adoptanteRouter.patch('/:id', verificarToken, verificarTipo('Adoptante', 'Admin'), sanitizeAdoptanteInput, update)
adoptanteRouter.delete('/:id', verificarToken, verificarTipo('Adoptante', 'Admin'), remove)