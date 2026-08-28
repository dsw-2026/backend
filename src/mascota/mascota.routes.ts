import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { create, findAll, findOne, remove, sanitizeMascotaInput, update } from '../mascota/mascota.controller.js'
//import { sanitizeMascotaInput, findAll, findOne, create, update, remove } from './mascota.controller.js'

export const mascotaRouter = Router()

// Lectura pública: sin auth
mascotaRouter.get('/', findAll)
mascotaRouter.get('/:id', findOne)

// Alta: solo Publicador. 
mascotaRouter.post('/', verificarToken, verificarTipo('Publicador'), sanitizeMascotaInput, create)

// Edición y baja: el Publicador dueño, o un Admin (moderación de contenido
// inapropiado). Que el Publicador sea el DUEÑO de esta mascota puntual se
// valida adentro del controller, porque recién se sabe después de traerla
// de la base.
mascotaRouter.put('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), sanitizeMascotaInput, update)
mascotaRouter.patch('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), sanitizeMascotaInput, update)
mascotaRouter.delete('/:id', verificarToken, verificarTipo('Publicador', 'Admin'), remove)