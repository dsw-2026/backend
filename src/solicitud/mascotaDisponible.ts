import { EstadoMascota } from '../mascota/estadoMascota.js'

// Regla de negocio central del Epic A: una mascota solo puede recibir
// una nueva solicitud si está DISPONIBLE. Vive en su propio archivo,
// sin importar ninguna entidad decorada, para poder testearla de forma
// completamente aislada.
export function mascotaDisponibleParaSolicitud(mascota: { estado: EstadoMascota }): boolean {
  return mascota.estado === EstadoMascota.DISPONIBLE
}