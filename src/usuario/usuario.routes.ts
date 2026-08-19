import { Router } from 'express'
import { sanitizeUsuarioInput, findAll, findOne, create, update, remove, verificar } from './usuario.controller.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizeUsuarioInput, create)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id/verificar', verificar)
usuarioRouter.delete('/:id', remove)