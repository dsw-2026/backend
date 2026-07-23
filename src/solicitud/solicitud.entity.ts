import { Entity, ManyToOne, Property, Enum } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Mascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'

export enum EstadoSolicitud{
  APROBADO = 'APROBADO',
  PENDIENTE = 'PENDIENTE',
  RECHAZADO = 'RECHAZADO',
  CANCELADO = 'CANCELADO'
}
@Entity()
export class Solicitud extends BaseEntity{
  @Enum(() => EstadoSolicitud)
  estado!: EstadoSolicitud

  @Property()
  fechaSolicitud!: Date

  @Property({nullable: true}) 
  fechaResolucion?: Date

  @ManyToOne(()=>Adoptante, {nullable: false})
  adoptante!: Adoptante

  @ManyToOne (()=>Mascota, {nullable: false})
  mascota!: Mascota

}