import { Request, Response } from 'express'
import { SpeciesService } from './species.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class SpeciesController {
  private service = new SpeciesService()

  findAll = async (req: Request, res: Response) => {
    const species = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Species found', species))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const species = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Species found', species))
  }

  create = async (req: Request, res: Response) => {
    const species = await this.service.create(req.body.validated)
    return res.status(201).json(new ApiResponse('Species created', species))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const species = await this.service.update(id, req.body.validated)
    return res.status(200).json(new ApiResponse('Species updated', species))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Species deleted successfully', null))
  }
}

export const speciesController = new SpeciesController()