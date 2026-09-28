import { Request, Response } from 'express'
import { AdminService } from './admin.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class AdminController {
  private service = new AdminService()

  findAll = async (req: Request, res: Response) => {
    const admins = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Administradores encontrados', admins))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const admin = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Administrador encontrado', admin))
  }
}

export const adminController = new AdminController()