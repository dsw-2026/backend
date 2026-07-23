import { Router } from 'express'
import {create, aceptar, rechazar, cancelar, findAll, findByAdoptante, findByMascota} from './solicitud.controller.js'

export const solicitudRouter = Router()

solicitudRouter.post('/', create)

solicitudRouter.patch('/:id/aceptar', aceptar)

solicitudRouter.patch('/:id/rechazar', rechazar)

solicitudRouter.patch('/:id/cancelar', cancelar)

solicitudRouter.get('/', findAll)

solicitudRouter.get('/adoptante/:id', findByAdoptante)

solicitudRouter.get('/mascota/:id', findByMascota)
