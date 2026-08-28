import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { sanitizeEspecieInput, findAll, findOne, create, update, remove } from './especie.controller.js'

export const especieRouter = Router()

// Lectura pública: el catálogo alimenta los formularios de registro y el
// buscador de mascotas, que se usan sin estar logueado.
especieRouter.get('/', findAll)
especieRouter.get('/:id', findOne)

// Escritura: solo Admin. Mantener el catálogo es una de sus capacidades.
especieRouter.post('/', verificarToken, verificarTipo('Admin'), sanitizeEspecieInput, create)
especieRouter.put('/:id', verificarToken, verificarTipo('Admin'), sanitizeEspecieInput, update)
especieRouter.patch('/:id', verificarToken, verificarTipo('Admin'), sanitizeEspecieInput, update)
especieRouter.delete('/:id', verificarToken, verificarTipo('Admin'), remove)