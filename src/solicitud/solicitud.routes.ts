import { Router } from 'express'
import { sanitizeSolicitudInput, findAll, findOne, create, aprobar, rechazar, remove } from './solicitud.controller.js'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'

export const solicitudRouter = Router()

// Lectura: no hay acceso público. Una solicitud de adopción es información
// privada entre el Adoptante y el Publicador; el Admin la ve por supervisión.
// QUÉ solicitudes ve cada uno se resuelve en el controller, porque depende de
// a quién pertenecen y eso recién se sabe consultando la base.
solicitudRouter.get('/', verificarToken, verificarTipo('Adoptante', 'Publicador', 'Admin'), findAll)
solicitudRouter.get('/:id', verificarToken, verificarTipo('Adoptante', 'Publicador', 'Admin'), findOne)

// Alta: solo Adoptante. Es el CUU "Solicitar adopción de una mascota".
solicitudRouter.post('/', verificarToken, verificarTipo('Adoptante'), sanitizeSolicitudInput, create)

// Aprobar y rechazar: solo Publicador. Es el CUU "Adoptar una mascota" 
solicitudRouter.patch('/:id/aprobar', verificarToken, verificarTipo('Publicador'), aprobar)
solicitudRouter.patch('/:id/rechazar', verificarToken, verificarTipo('Publicador'), rechazar)

// Baja: el adoptante que la creó, o el publicador dueño de la mascota.S
solicitudRouter.delete('/:id', verificarToken, verificarTipo('Adoptante', 'Publicador'), remove)