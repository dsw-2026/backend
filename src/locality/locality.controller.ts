import { Request, Response } from 'express'
import { LocalityService } from './locality.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class LocalityController {
  private service = new LocalityService()

  findAll = async (req: Request, res: Response) => {
    const localities = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Localidades encontradas', localities))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const locality = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Localidad encontrada', locality))
  }

  create = async (req: Request, res: Response) => {
    const locality = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Localidad creada', locality))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const locality = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Localidad actualizada', locality))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Localidad eliminada exitosamente', null))
  }
}

export const localityController = new LocalityController()