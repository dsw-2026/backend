import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Mascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

@Entity()
export class Solicitud extends BaseEntity {
  @Enum(() => EstadoSolicitud)
  estado!: EstadoSolicitud

  @Property({ nullable: false, onCreate: () => new Date() })
  fechaSolicitud!: Date

  @Property({ nullable: true, columnType: 'text' })
  mensaje?: string

  @Property({ nullable: false })
  nivelCompatibilidad!: number

  @ManyToOne(() => Mascota, { nullable: false })
  mascota!: Rel<Mascota>

  @ManyToOne(() => Adoptante, { nullable: false })
  adoptante!: Rel<Adoptante>
}