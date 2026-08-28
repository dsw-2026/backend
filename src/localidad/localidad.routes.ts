import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { sanitizeLocalidadInput, findAll, findOne, create, update, remove } from './localidad.controller.js'

export const localidadRouter = Router()

// Lectura pública: el catálogo alimenta los formularios de registro y el
// buscador de mascotas, que se usan sin estar logueado.
localidadRouter.get('/', findAll)
localidadRouter.get('/:id', findOne)

// Escritura: solo Admin. Mantener el catálogo es una de sus capacidades.
localidadRouter.post('/', verificarToken, verificarTipo('Admin'), sanitizeLocalidadInput, create)
localidadRouter.put('/:id', verificarToken, verificarTipo('Admin'), sanitizeLocalidadInput, update)
localidadRouter.patch('/:id', verificarToken, verificarTipo('Admin'), sanitizeLocalidadInput, update)
localidadRouter.delete('/:id', verificarToken, verificarTipo('Admin'), remove)