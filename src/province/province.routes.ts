import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createProvinceSchema, updateProvinceSchema } from './schemas/province.schema.js'
import { provinceController } from './province.controller.js'

export const provinceRouter = Router()

// Public read: anyone can see the provinces.
provinceRouter.get('/', provinceController.findAll)
provinceRouter.get('/:id', provinceController.findOne)

// Write: only Admin.
provinceRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createProvinceSchema), provinceController.create)
provinceRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)
provinceRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)
provinceRouter.delete('/:id', verificarToken, verificarTipo('Admin'), provinceController.remove)