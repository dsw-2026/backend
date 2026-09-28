import { Request, Response } from 'express'
import { UserService } from './user.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'

export class UserController {
  private service = new UserService()

  findAll = async (req: Request, res: Response) => {
    const users = await this.service.findAll()
    return res.status(200).json(new ApiResponse('Usuarios encontrados', users))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const user = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Usuario encontrado', user))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Usuario eliminado exitosamente', null))
  }
}

export const userController = new UserController()