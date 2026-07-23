import { orm } from '../shared/db/orm.js'
import { Solicitud, EstadoSolicitud } from './solicitud.entity.js'
import { Mascota, EstadoMascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'

export async function solicitarAdopcion(datos: {
  adoptanteId: number
  mascotaId: number
}) {

  const adoptante = await orm.em.findOne(Adoptante, datos.adoptanteId)
  if (!adoptante) {
    throw new Error("El adoptante no existe")
  }

  const mascota = await orm.em.findOne(Mascota, datos.mascotaId)
  if (!mascota) {
    throw new Error("La mascota no existe")
  }

  if (mascota.estado !== EstadoMascota.DISPONIBLE) {
    throw new Error("La mascota no está disponible para adopción")
  }

  const solicitudExistente = await orm.em.findOne(Solicitud, {
    adoptante,
    mascota,
    estado: EstadoSolicitud.PENDIENTE
  })

  if (solicitudExistente) {
    throw new Error("Ya existe una solicitud pendiente para esta mascota")
  }

  const solicitud = orm.em.create(Solicitud, {
    estado: EstadoSolicitud.PENDIENTE,
    fechaSolicitud: new Date(),
    adoptante,
    mascota,
  })

  await orm.em.flush()

  return solicitud
}



export async function aceptarSolicitud(id: number) {

  const solicitud = await orm.em.findOne(Solicitud, id, {
    populate: ['mascota'] // busca solicitud por id y busca la mascota que le corresponde
  })

  if (!solicitud) {
    throw new Error("La solicitud no existe")
  }

  if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
    throw new Error("La solicitud no está pendiente")
  }

  solicitud.estado = EstadoSolicitud.APROBADO
  solicitud.mascota.estado = EstadoMascota.ADOPTADA

  // rechazar todas las demas solicitudes de dicha mascota 

  const otrasSolicitudes = await orm.em.find(Solicitud, {
    mascota: solicitud.mascota,
    estado: EstadoSolicitud.PENDIENTE
  })

  otrasSolicitudes.forEach(s => {
    if (s.id !== solicitud.id) {
      s.estado = EstadoSolicitud.RECHAZADO
    }
  })

  await orm.em.flush()

  return solicitud
}

export async function rechazarSolicitud(id: number) {

  const solicitud = await orm.em.findOne(Solicitud, id)

  if (!solicitud) {
    throw new Error("La solicitud no existe")
  }

  if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
    throw new Error("La solicitud no está pendiente y solo se pueden rechazar solicitudes con dicho estado")
  }

  solicitud.estado = EstadoSolicitud.RECHAZADO

  await orm.em.flush()

  return solicitud
}

export async function cancelarSolicitud(id: number) {

  const solicitud = await orm.em.findOne(Solicitud, id)

  if (!solicitud) {
    throw new Error("La solicitud no existe")
  }

  if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
    throw new Error("La solicitud no está pendiente y solo se pueden rechazar solicitudes con dicho estado")
  }

  solicitud.estado = EstadoSolicitud.RECHAZADO

  await orm.em.flush()

  return solicitud
}