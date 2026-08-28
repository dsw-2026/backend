import { Router } from 'express'
import { sanitizeUsuarioInput, findAll, findOne, create, update, remove, verificar } from './usuario.controller.js'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', verificarToken, verificarTipo('Admin'), findAll)
usuarioRouter.get('/:id', verificarToken, verificarTipo('Admin'), findOne)
usuarioRouter.patch('/:id/verificar', verificarToken, verificarTipo('Admin'), verificar)

/*
Las siguientes rutas no aplican porque usuario es una entidad abstracta
usuarioRouter.post('/', sanitizeUsuarioInput, create)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.delete('/:id', remove)
*/


