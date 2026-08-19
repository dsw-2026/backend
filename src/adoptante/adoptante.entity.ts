import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { Usuario } from '../usuario/usuario.entity.js'

export const TipoVivienda = {
  CASA: 'CASA',
  DEPARTAMENTO: 'DEPARTAMENTO',
  OTRO: 'OTRO',
} as const
export type TipoVivienda = (typeof TipoVivienda)[keyof typeof TipoVivienda]

// Adoptante extiende Usuario y comparte la misma tabla.
// El valor "adoptante" identifica los registros de esta subclase.
@Entity({ discriminatorValue: 'adoptante' })
export class Adoptante extends Usuario {
  // Texto libre: demasiada variedad de ocupaciones como para una lista cerrada.
  @Property({ nullable: true })
  occupation?: string

// Enum para limitar el tipo de vivienda a opciones predefinidas.
  @Enum({ items: () => Object.values(TipoVivienda), nullable: true })
  tipoVivienda?: TipoVivienda

  @Property({ nullable: true })
  tienePatio?: boolean

  // Se separó en dos campos (booleano + detalle) 
  @Property({ nullable: true })
  tieneOtrosAnimales?: boolean

  @Property({ nullable: true })
  otrosAnimalesDetalle?: string
}