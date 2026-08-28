import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { sanitizeProvinciaInput, findAll, findOne, create, update, remove } from './provincia.controller.js'

export const provinciaRouter = Router()

// Lectura pública: el catálogo alimenta los formularios de registro y el
// buscador de mascotas, que se usan sin estar logueado.
provinciaRouter.get('/', findAll)
provinciaRouter.get('/:id', findOne)

// Escritura: solo Admin. Mantener el catálogo es una de sus capacidades.
provinciaRouter.post('/', verificarToken, verificarTipo('Admin'), sanitizeProvinciaInput, create)
provinciaRouter.put('/:id', verificarToken, verificarTipo('Admin'), sanitizeProvinciaInput, update)
provinciaRouter.patch('/:id', verificarToken, verificarTipo('Admin'), sanitizeProvinciaInput, update)
provinciaRouter.delete('/:id', verificarToken, verificarTipo('Admin'), remove)