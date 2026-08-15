import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Solicitud, EstadoSolicitud } from './solicitud.entity.js'
import { Mascota, EstadoMascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'

const POPULATE = ['mascota', 'mascota.especie', 'mascota.caracteristica', 'adoptante'] as const

function sanitizeSolicitudInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    mensaje: req.body.mensaje,
    mascota: req.body.mascota,
    adoptante: req.body.adoptante,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] == null) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

function calcularNivelCompatibilidad(mascota: Mascota, adoptante: Adoptante): number {
  let nivel = 0
  const caracteristica = mascota.caracteristica

  if (caracteristica.toleraNinos === 'SI') nivel += 1

  if (adoptante.tieneOtrosAnimales && caracteristica.toleraAnimales === 'SI') {
    nivel += 2
  } else if (adoptante.tieneOtrosAnimales && caracteristica.toleraAnimales === 'NO') {
    nivel -= 2
  }

  if (adoptante.tienePatio && (caracteristica.tamanio === 'GRANDE' || caracteristica.tamanio === 'GIGANTE')) {
    nivel += 1
  }

  return nivel
}

async function findAll(req: Request, res: Response) {
  try {
    const filtro: any = {}
    if (req.query.estado) {
      filtro.estado = req.query.estado
    }
    const solicitudes = await orm.em.find(Solicitud, filtro, { populate: POPULATE })
    res.status(200).json({ message: 'Solicitudes encontradas', data: solicitudes })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar solicitudes' })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id }, { populate: POPULATE })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }
    res.status(200).json({ message: 'Solicitud encontrada', data: solicitud })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar la solicitud' })
  }
}

async function create(req: Request, res: Response) {
  try {
    const mascotaId = Number(req.body.sanitizedInput.mascota)
    const adoptanteId = Number(req.body.sanitizedInput.adoptante)

    const mascota = await orm.em.findOne(Mascota, { id: mascotaId }, { populate: ['caracteristica'] })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }

    if (mascota.estado !== EstadoMascota.DISPONIBLE) {
      return res.status(409).json({ message: 'La mascota no está disponible para adopción' })
    }

    const adoptante = await orm.em.findOne(Adoptante, { id: adoptanteId })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }

    const nivelCompatibilidad = calcularNivelCompatibilidad(mascota, adoptante)

    const solicitud = orm.em.create(Solicitud, {
      mensaje: req.body.sanitizedInput.mensaje,
      mascota,
      adoptante,
      estado: EstadoSolicitud.PENDIENTE,
      nivelCompatibilidad,
      fechaSolicitud: new Date(),
    })

    await orm.em.flush()
    res.status(201).json({ message: 'Solicitud creada', data: solicitud })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la solicitud' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }
    orm.em.remove(solicitud)
    await orm.em.flush()
    res.status(200).json({ message: 'Solicitud eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la solicitud' })
  }
}

export { sanitizeSolicitudInput, findAll, findOne, create, remove }