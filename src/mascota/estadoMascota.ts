export const EstadoMascota = {
  DISPONIBLE: 'DISPONIBLE',
  EN_PROCESO: 'EN_PROCESO',
  ADOPTADA: 'ADOPTADA',
  NO_DISPONIBLE: 'NO_DISPONIBLE',
} as const
export type EstadoMascota = (typeof EstadoMascota)[keyof typeof EstadoMascota]