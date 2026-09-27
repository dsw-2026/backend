import { Router } from 'express'
import { verificarToken, verificarTipo } from '../auth/auth.middleware.js'
import { validate } from '../shared/middlewares/validate.middleware.js'
import { createProvinceSchema, updateProvinceSchema, idParamSchema } from './schemas/province.schema.js'
import { provinceController } from './province.controller.js'

export const provinceRouter = Router()

provinceRouter.get('/', provinceController.findAll)
provinceRouter.get('/:id', validate(idParamSchema), provinceController.findOne)

provinceRouter.post('/', verificarToken, verificarTipo('Admin'), validate(createProvinceSchema), provinceController.create)
provinceRouter.put('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)
provinceRouter.patch('/:id', verificarToken, verificarTipo('Admin'), validate(updateProvinceSchema), provinceController.update)
provinceRouter.delete('/:id', verificarToken, verificarTipo('Admin'), validate(idParamSchema), provinceController.remove)