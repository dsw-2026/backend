import { Request, Response } from 'express'
import { ProvinceService } from './province.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class ProvinceController {
  private service = new ProvinceService()

  findAll = async (req: Request, res: Response) => {
    const provinces = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Provinces found', provinces))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const province = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Province found', province))
  }

  create = async (req: Request, res: Response) => {
    const province = await this.service.create(req.body.validated)
    return res.status(201).json(new ApiResponse('Province created', province))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const province = await this.service.update(id, req.body.validated)
    return res.status(200).json(new ApiResponse('Province updated', province))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Province deleted successfully', null))
  }
}

export const provinceController = new ProvinceController()