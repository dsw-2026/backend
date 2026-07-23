import { Request, Response} from 'express'
import { solicitarAdopcion, aceptarSolicitud, rechazarSolicitud, cancelarSolicitud} from './solicitud.services.js'
import { Solicitud } from './solicitud.entity.js'
import { orm } from '../shared/db/orm.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'
import { populate } from 'dotenv'
import { Mascota } from '../mascota/mascota.entity.js'

export async function create(req: Request, res: Response) {
  try {
    const resultado = await solicitarAdopcion(req.body) // el usuario adoptante se manda en el body, mas adelante agregar autenticacion y cambiar controller y service
    res.status(201).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
// TO DO: los endpoints de aceptar y cancelar deberian estar protegidos para que solo un admin/publicador tengan acceso, con Middlewares de autorizacion

export async function aceptar(req: Request, res: Response) {
  try {

    const id = Number(req.params.id)

    const resultado = await aceptarSolicitud(id)

    res.status(200).json(resultado)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

export async function rechazar(req: Request, res: Response) {
  try {

    const id = Number(req.params.id)

    const resultado = await rechazarSolicitud(id)

    res.status(200).json(resultado)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

// TO DO : este endpoint esta limitado a un usuario con sus propias solicitudes

export async function cancelar(req: Request, res: Response) {
  try {

    const id = Number(req.params.id)

    const resultado = await cancelarSolicitud(id)

    res.status(200).json(resultado)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

export async function findAll(req: Request, res: Response) {
  try{
    const solicitudes = await orm.em.find(Solicitud,{},{ populate: ['adoptante', 'mascota'] })
    res.status(200).json({message: 'Solicitudes encontradas', data: solicitudes}
    )
  } catch (error: any){
    res.status(500).json({message: error.message})
  }
}

export async function findByAdoptante(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

    const adoptante = await orm.em.findOne(Adoptante, { id })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }

    const solicitudes = await orm.em.find(Solicitud, {adoptante}, {populate: ['mascota']})
    res.status(200).json({ message: 'Solicitudes encontradas del adoptante', data: solicitudes })

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export async function findByMascota(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)

    const mascota = await orm.em.findOne(Mascota, { id })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrado' })
    }

    const solicitudes = await orm.em.find(Solicitud, {mascota}, {populate: ['adoptante']})
    res.status(200).json({ message: 'Solicitudes encontradas de la mascota', data: solicitudes })

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

