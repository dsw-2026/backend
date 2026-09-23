import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validateDto } from '../shared/middlewares/validate.middleware.js'
import { EspecieDto } from './dto/especie.dto.js'
import { especieController } from './especie.controller.js'

export const especieRouter = Router()

// Lectura pública: cualquiera puede ver el catálogo de especies.
especieRouter.get('/', especieController.findAll)
especieRouter.get('/:id', especieController.findOne)

// Escritura: solo Admin. validateDto valida el body contra el DTO antes
// de llegar al controller (reemplaza al viejo sanitizeInput).
especieRouter.post('/', verificarToken, verificarTipo('Admin'), validateDto(EspecieDto), especieController.create)
especieRouter.put('/:id', verificarToken, verificarTipo('Admin'), validateDto(EspecieDto), especieController.update)
especieRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validateDto(EspecieDto), especieController.update)
especieRouter.delete('/:id', verificarToken, verificarTipo('Admin'), especieController.remove)