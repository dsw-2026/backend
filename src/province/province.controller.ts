import { Request, Response } from 'express'
import { ProvinceService } from './province.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class ProvinceController {
  private service = new ProvinceService()

  findAll = async (req: Request, res: Response) => {
    const provinces = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Provincias encontradas', provinces))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const province = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Provincia encontrada', province))
  }

  create = async (req: Request, res: Response) => {
    const province = await this.service.create(req.body)
    return res.status(201).json(new ApiResponse('Provincia creada', province))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const province = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Provincia actualizada', province))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Provincia eliminada exitosamente', null))
  }
}

export const provinceController = new ProvinceController()