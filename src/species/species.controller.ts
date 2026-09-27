import { Request, Response } from 'express'
import { SpeciesService } from './species.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class SpeciesController {
  private service = new SpeciesService()

  findAll = async (req: Request, res: Response) => {
    const species = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Especies encontradas', species))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const species = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Especie encontrada', species))
  }

  create = async (req: Request, res: Response) => {
    const species = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Especie creada', species))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const species = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Especie actualizada', species))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Especie eliminada exitosamente', null))
  }
}

export const speciesController = new SpeciesController()