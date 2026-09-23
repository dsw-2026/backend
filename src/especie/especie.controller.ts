import { Request, Response } from 'express'
import { EspecieService } from './especie.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class EspecieController {
  private service = new EspecieService()

  findAll = async (req: Request, res: Response) => {
    const especies = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Especies encontradas', especies))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const especie = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Especie encontrada', especie))
  }

  create = async (req: Request, res: Response) => {
    const especie = await this.service.create(req.body.sanitizedInput)
    return res.status(201).json(new ApiResponse('Especie creada', especie))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const especie = await this.service.update(id, req.body.sanitizedInput)
    return res.status(200).json(new ApiResponse('Especie actualizada', especie))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Especie eliminada exitosamente', null))
  }
}

export const especieController = new EspecieController()