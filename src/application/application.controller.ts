import { Request, Response } from 'express'
import { ApplicationService } from './application.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class ApplicationController {
  private service = new ApplicationService()

  findAll = async (req: Request, res: Response) => {
    const { id, type } = req.user!
    const applications = await this.service.findAll(id, type, req.query.status as string | undefined)
    return res.status(200).json(new ApiResponse('Solicitudes encontradas', applications))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const application = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Solicitud encontrada', application))
  }

  create = async (req: Request, res: Response) => {
    // El adoptante es el usuario logueado (del token).
    const adopterId = req.user!.id
    const application = await this.service.create(req.body, adopterId)
    return res.status(201).json(new ApiResponse('Solicitud creada', application))
  }

  approve = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const application = await this.service.approve(id, req.user!.id)
    return res.status(200).json(new ApiResponse('Solicitud aprobada', application))
  }

  reject = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const application = await this.service.reject(id, req.user!.id)
    return res.status(200).json(new ApiResponse('Solicitud rechazada', application))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { id: userId, type } = req.user!
    await this.service.remove(id, userId, type)
    return res.status(200).json(new ApiResponse('Solicitud eliminada exitosamente', null))
  }
}

export const applicationController = new ApplicationController()