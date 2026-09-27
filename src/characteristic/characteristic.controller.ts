import { Request, Response } from 'express'
import { CharacteristicService } from './characteristic.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class CharacteristicController {
  private service = new CharacteristicService()

  findAll = async (req: Request, res: Response) => {
    const characteristics = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Características encontradas', characteristics))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const characteristic = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Característica encontrada', characteristic))
  }

  create = async (req: Request, res: Response) => {
    const characteristic = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Característica creada', characteristic))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const characteristic = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Característica actualizada', characteristic))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Característica eliminada exitosamente', null))
  }
}

export const characteristicController = new CharacteristicController()