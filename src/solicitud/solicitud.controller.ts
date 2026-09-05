import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Solicitud, EstadoSolicitud } from './solicitud.entity.js'
import { Mascota, EstadoMascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'
import { mascotaDisponibleParaSolicitud } from './mascotaDisponible.js'

// Se incluye mascota.especie y mascota.caracteristica 
// para que la respuesta traiga la información completa de la mascota,
// no solo su id, útil para que el Publicador evalúe la solicitud.

const POPULATE = [
  'mascota',
  'mascota.especie',
  'mascota.caracteristica',
  'adoptante',
  'adoptante.localidad',
  'adoptante.localidad.provincia',
] as const

function sanitizeSolicitudInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    mensaje: req.body.mensaje,
    mascota: req.body.mascota,
    adoptante: req.body.adoptante,
    energiaDeseada: req.body.energiaDeseada,
    tamanioDeseado: req.body.tamanioDeseado,
    toleraNinosDeseado: req.body.toleraNinosDeseado,
    toleraAnimalesDeseado: req.body.toleraAnimalesDeseado,
    toleraEncierroDeseado: req.body.toleraEncierroDeseado,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const { id, tipo } = req.usuario!
    const filtro: any = {}
    if (req.query.estado) filtro.estado = req.query.estado

    if (tipo === 'Adoptante') {
      filtro.adoptante = id
    } else if (tipo === 'Publicador') {
      filtro.mascota = { publicador: id }
    } else if (tipo === 'Admin') {
      // El Admin ve TODAS las solicitudes, sin filtro de pertenencia.
    } else {
      return res.status(403).json({ message: 'Rol no autorizado' })
    }

    const solicitudes = await orm.em.find(Solicitud, filtro, { populate: POPULATE, orderBy: { fechaSolicitud: 'DESC' } })
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

    const { id: userId, tipo } = req.usuario!
    const esElAdoptante = tipo === 'Adoptante' && solicitud.adoptante.id === userId
    const esElPublicador = tipo === 'Publicador' && solicitud.mascota.publicador.id === userId
    const esAdmin = tipo === 'Admin'

    if (!esElAdoptante && !esElPublicador && !esAdmin) {
      return res.status(403).json({ message: 'No tenés acceso a esta solicitud' })
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
    const adoptanteId = req.usuario!.id

    const mascota = await orm.em.findOne(Mascota, { id: mascotaId }, { populate: ['caracteristica'] })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }

    if (!mascotaDisponibleParaSolicitud(mascota)) {
      return res.status(409).json({ message: 'La mascota no está disponible para adopción' })
    }

    const adoptante = await orm.em.findOne(Adoptante, { id: adoptanteId })
    if (!adoptante) {
      return res.status(404).json({ message: 'Adoptante no encontrado' })
    }

    const solicitudExistente = await orm.em.findOne(Solicitud, { mascota: mascotaId, adoptante: adoptanteId })
    if (solicitudExistente) {
      return res.status(409).json({ message: 'Este adoptante ya tiene una solicitud registrada para esta mascota' })
    }

    const solicitud = orm.em.create(Solicitud, {
      mensaje: req.body.sanitizedInput.mensaje,
      mascota,
      adoptante,
      estado: EstadoSolicitud.PENDIENTE,
      fechaSolicitud: new Date(),
      energiaDeseada: req.body.sanitizedInput.energiaDeseada,
      tamanioDeseado: req.body.sanitizedInput.tamanioDeseado,
      toleraNinosDeseado: req.body.sanitizedInput.toleraNinosDeseado,
      toleraAnimalesDeseado: req.body.sanitizedInput.toleraAnimalesDeseado,
      toleraEncierroDeseado: req.body.sanitizedInput.toleraEncierroDeseado,
    })

    await orm.em.flush()
    res.status(201).json({ message: 'Solicitud creada', data: solicitud })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la solicitud' })
  }
}

async function aprobar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id }, { populate: ['mascota'] })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }
    if (solicitud.mascota.publicador.id !== req.usuario!.id) {
      return res.status(403).json({ message: 'Publicador no autorizado' })
    }
    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      return res.status(409).json({ message: 'La solicitud ya fue evaluada' })
    }

    const mascota = solicitud.mascota

    if (!mascotaDisponibleParaSolicitud(mascota)) {
      return res.status(409).json({ message: 'La mascota ya no está disponible para adopción' })
    }

    solicitud.estado = EstadoSolicitud.APROBADA
    mascota.estado = EstadoMascota.ADOPTADA

    const otrasSolicitudesPendientes = await orm.em.find(Solicitud, {
      mascota: mascota.id,
      estado: EstadoSolicitud.PENDIENTE,
      id: { $ne: solicitud.id },
    })
    otrasSolicitudesPendientes.forEach((otra) => {
      otra.estado = EstadoSolicitud.RECHAZADA
    })

    await orm.em.flush()
    await orm.em.populate(solicitud, POPULATE)
    res.status(200).json({ message: 'Solicitud aprobada', data: solicitud })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al aprobar la solicitud' })
  }
}

async function rechazar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id }, { populate: ['mascota'] })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }
    if (solicitud.mascota.publicador.id !== req.usuario!.id) {
      return res.status(403).json({ message: 'Publicador no autorizado' })
    }
    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      return res.status(409).json({ message: 'La solicitud ya fue evaluada' })
    }

    solicitud.estado = EstadoSolicitud.RECHAZADA
    await orm.em.flush()
    res.status(200).json({ message: 'Solicitud rechazada', data: solicitud })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al rechazar la solicitud' })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id }, { populate: ['mascota', 'adoptante'] })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }

    const { id: userId, tipo } = req.usuario!
    const esElAdoptante = tipo === 'Adoptante' && solicitud.adoptante.id === userId
    const esElPublicador = tipo === 'Publicador' && solicitud.mascota.publicador.id === userId

    if (!esElAdoptante && !esElPublicador) {
      return res.status(403).json({ message: 'No tenés permiso para eliminar esta solicitud' })
    }

    orm.em.remove(solicitud)
    await orm.em.flush()
    res.status(200).json({ message: 'Solicitud eliminada exitosamente' })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la solicitud' })
  }
}

export { sanitizeSolicitudInput, findAll, findOne, create, aprobar, rechazar, remove }