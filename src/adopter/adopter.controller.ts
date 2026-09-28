import { Request, Response } from 'express'
import { AdopterService } from './adopter.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class AdopterController {
  private service = new AdopterService()

  findAll = async (req: Request, res: Response) => {
    const adopters = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Adoptantes encontrados', adopters))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const adopter = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Adoptante encontrado', adopter))
  }

  create = async (req: Request, res: Response) => {
    const adopter = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Adoptante creado', adopter))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const adopter = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Adoptante actualizado', adopter))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Adoptante eliminado exitosamente', null))
  }
}

export const adopterController = new AdopterController()