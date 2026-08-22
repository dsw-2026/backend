import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Mascota } from '../mascota/mascota.entity.js'
import { Adoptante } from '../adoptante/adoptante.entity.js'
import { Energia, Tamanio, Tolerancia } from '../caracteristica/caracteristica.entity.js'

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

  // Preferencias que declara el Adoptante en ESTA solicitud puntual. Se
  // comparan solo contra Caracteristica, uno a uno (decisión del equipo:
  // los atributos del Adoptante no entran en esta comparación). El
  // resultado se calcula al vuelo cuando se consulta, no se persiste —
  // ver calcularDesglose en el frontend.
  @Enum(() => Object.values(Energia))
  energiaDeseada!: Energia

  @Enum(() => Object.values(Tamanio))
  tamanioDeseado!: Tamanio

  @Enum(() => Object.values(Tolerancia))
  toleraNinosDeseado!: Tolerancia

  @Enum(() => Object.values(Tolerancia))
  toleraAnimalesDeseado!: Tolerancia

  @Enum(() => Object.values(Tolerancia))
  toleraEncierroDeseado!: Tolerancia

  // Sin cascada: no se debe poder borrar una Mascota o un Adoptante
  // mientras tengan solicitudes asociadas, para no perder el historial.
  @ManyToOne(() => Mascota, { nullable: false })
  mascota!: Rel<Mascota>

  @ManyToOne(() => Adoptante, { nullable: false })
  adoptante!: Rel<Adoptante>
}