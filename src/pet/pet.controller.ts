import { Request, Response } from 'express'
import { PetService } from './pet.service.js'
import { ApiResponse } from '../shared/errors/api.response.js'
import { ForbiddenError } from '../shared/errors/app.error.js'

export class PetController {
  private service = new PetService()

  findAll = async (req: Request, res: Response) => {
    const pets = await this.service.findAll({
      status: req.query.status as string | undefined,
      species: req.query.species ? Number(req.query.species) : undefined,
    })
    return res.status(200).json(new ApiResponse('Mascotas encontradas', pets))
  }

  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const pet = await this.service.findOne(id)
    return res.status(200).json(new ApiResponse('Mascota encontrada', pet))
  }

  create = async (req: Request, res: Response) => {
    // El publicador dueño de la mascota es el usuario logueado (del token).
    const publisherId = req.user!.id
    const pet = await this.service.create(req.body, publisherId)
    return res.status(201).json(new ApiResponse('Mascota creada', pet))
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const pet = await this.service.findOne(id)

    const { id: userId, type } = req.user!
    const isOwner = type === 'Publisher' && pet.publisher.id === userId
    const isAdmin = type === 'Admin'
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('No tenés permiso para editar esta mascota')
    }

    const updated = await this.service.update(id, req.body)
    return res.status(200).json(new ApiResponse('Mascota actualizada', updated))
  }

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const pet = await this.service.findOne(id)

    const { id: userId, type } = req.user!
    const isOwner = type === 'Publisher' && pet.publisher.id === userId
    const isAdmin = type === 'Admin'
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('No tenés permiso para eliminar esta mascota')
    }

    await this.service.remove(id)
    return res.status(200).json(new ApiResponse('Mascota eliminada exitosamente', null))
  }
}

export const petController = new PetController()