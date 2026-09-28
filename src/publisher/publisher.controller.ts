import { Request, Response } from 'express'
import { PublisherService } from './publisher.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class PublisherController {
  private service = new PublisherService()

  findAll = async (req: Request, res: Response) => {
    const publishers = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Publicadores encontrados', publishers))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const publisher = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Publicador encontrado', publisher))
  }

  create = async (req: Request, res: Response) => {
    const publisher = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Publicador creado', publisher))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const publisher = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Publicador actualizado', publisher))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Publicador eliminado exitosamente', null))
  }
}

export const publisherController = new PublisherController()