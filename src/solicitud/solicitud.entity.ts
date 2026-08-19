import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Mascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'

export const EstadoSolicitud = {
  PENDIENTE: 'PENDIENTE',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
} as const
export type EstadoSolicitud = (typeof EstadoSolicitud)[keyof typeof EstadoSolicitud]

@Entity()
export class Solicitud extends BaseEntity {
  // PENDIENTE es un estado válido en sí mismo (no la ausencia de estado):
  // por eso es obligatorio (nullable: false), nunca queda vacío. Se fuerza
  // en el controller al crear, sin importar qué mande el cliente.
  @Enum(() => Object.values(EstadoSolicitud))
  estado!: EstadoSolicitud

  @Property({ nullable: false, onCreate: () => new Date() })
  fechaSolicitud!: Date

  @Property({ nullable: true, columnType: 'text' })
  mensaje?: string

  // Atributo derivado (calculado): se computa UNA VEZ al crear la
  // solicitud (calcularNivelCompatibilidad en el controller) y se
  // persiste como una "foto" de ese momento, en vez de recalcularse
  // dinámicamente cada vez que se consulta.
  @Property({ nullable: false })
  nivelCompatibilidad!: number

  // Sin cascada: no se debe poder borrar una Mascota o un Adoptante
  // mientras tengan solicitudes asociadas, para no perder el historial.
  @ManyToOne(() => Mascota, { nullable: false })
  mascota!: Rel<Mascota>

  @ManyToOne(() => Adoptante, { nullable: false })
  adoptante!: Rel<Adoptante>
}