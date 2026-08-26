import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { create, findAll, findOne, remove, sanitizeMascotaInput, update } from '../mascota/mascota.controller.js'
//import { sanitizeMascotaInput, findAll, findOne, create, update, remove } from './mascota.controller.js'

export const mascotaRouter = Router()

// Lectura pública: sin auth
mascotaRouter.get('/', findAll)
mascotaRouter.get('/:id', findOne)

// Escritura: solo Publicador autenticado
mascotaRouter.post('/', verificarToken, verificarTipo('Publicador'), sanitizeMascotaInput, create)
mascotaRouter.put('/:id', verificarToken, verificarTipo('Publicador'), sanitizeMascotaInput, update)
mascotaRouter.patch('/:id', verificarToken, verificarTipo('Publicador'), sanitizeMascotaInput, update)
mascotaRouter.delete('/:id', verificarToken, verificarTipo('Publicador'), remove)