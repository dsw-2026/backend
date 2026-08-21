import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { Solicitud, EstadoSolicitud } from './solicitud.entity.js'
import { Mascota, EstadoMascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'
import { removeNullish } from '../shared/utils/removeNullish.js'

// Se incluye mascota.especie y mascota.caracteristica 
// para que la respuesta traiga la información completa de la mascota,
// no solo su id, útil para que el Publicador evalúe la solicitud.

const POPULATE = ['mascota', 'mascota.especie', 'mascota.caracteristica', 'adoptante'] as const

function sanitizeSolicitudInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    mensaje: req.body.mensaje,
    mascota: req.body.mascota,
    adoptante: req.body.adoptante,
  }
  removeNullish(req.body.sanitizedInput)
  next()
}

// Compara datos de la caracteristica de la Mascota con datos del Adoptante, sumando/restando
// puntos según la compatibilidad. Se calcula UNA VEZ al crear la Solicitud
// y se persiste (no se recalcula dinámicamente), para que el número
// refleje exactamente la situación en el momento de la decisión.

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

// EPIC A: "Solicitar adopción". No es un CRUD simple: valida una regla de
// negocio (mascota disponible), calcula la compatibilidad, y permite
// MÚLTIPLES solicitudes por mascota mientras siga disponible (no se
// bloquea con la primera solicitud), para que el nivel de compatibilidad
// tenga sentido real al comparar candidatos en el Epic B.
async function create(req: Request, res: Response) {
  try {
    const mascotaId = Number(req.body.sanitizedInput.mascota)
    const adoptanteId = Number(req.body.sanitizedInput.adoptante)

    const mascota = await orm.em.findOne(Mascota, { id: mascotaId }, { populate: ['caracteristica'] })
    if (!mascota) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }

    // Valida la regla de negocio: solo se pueden procesar adopciones de mascotas disponibles.
    // 409 (Conflict): la petición es válida, pero el estado actual de la mascota lo impide.
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

// EPIC B: "Revisar solicitudes". Aprobar una Solicitud tiene efectos que van
// más allá de la propia Solicitud: la Mascota pasa a ADOPTADA (deja de poder
// recibir nuevas solicitudes, ver Epic A) y todas las demás Solicitudes
// PENDIENTE de esa misma Mascota se rechazan automáticamente, ya que una
// Mascota solo puede ser adoptada una vez.
async function aprobar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id }, { populate: ['mascota'] })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
    }

    // Solo se puede aprobar una solicitud que todavía esté PENDIENTE: evita
    // reabrir una decisión ya tomada (aprobar una ya RECHAZADA, o volver a
    // aprobar una ya APROBADA).
    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      return res.status(409).json({ message: 'La solicitud ya fue evaluada' })
    }

    const mascota = solicitud.mascota

    // Salvaguarda: si por alguna razón la mascota ya no está DISPONIBLE
    // (por ejemplo, otra solicitud sobre ella se aprobó primero), no se
    // permite aprobar esta también.
    if (mascota.estado !== EstadoMascota.DISPONIBLE) {
      return res.status(409).json({ message: 'La mascota ya no está disponible para adopción' })
    }

    solicitud.estado = EstadoSolicitud.APROBADA
    mascota.estado = EstadoMascota.ADOPTADA

    // Rechazo en cascada: el resto de las solicitudes PENDIENTE sobre la
    // misma mascota (si las hubiera, ver comentario de "múltiples
    // solicitudes" en create) dejan de tener sentido una vez que la mascota
    // fue adoptada por otro adoptante.
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

// Rechazar una Solicitud es un cambio de estado simple: no afecta a la
// Mascota (sigue DISPONIBLE, sigue pudiendo recibir/tener otras solicitudes
// PENDIENTE) ni a otras Solicitudes.
async function rechazar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const solicitud = await orm.em.findOne(Solicitud, { id })
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' })
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

// No hay update genérico: el cambio de estado (aprobar/rechazar) es
// responsabilidad del Epic B, que tiene efectos sobre la Mascota
// relacionada, no una simple modificación de datos.
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

export { sanitizeSolicitudInput, findAll, findOne, create, aprobar, rechazar, remove }