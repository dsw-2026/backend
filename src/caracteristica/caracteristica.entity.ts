import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

export const Tamanio = {
  PEQUENIO: 'PEQUENIO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE',
  GIGANTE: 'GIGANTE',
} as const
export type Tamanio = (typeof Tamanio)[keyof typeof Tamanio]

export const Energia = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
} as const
export type Energia = (typeof Energia)[keyof typeof Energia]

// Tolerancia incluye "DESCONOCIDO" porque todavía puede no haberse
// evaluado cómo se comporta el animal ante niños, otros animales o encierro.
export const Tolerancia = {
  SI: 'SI',
  NO: 'NO',
  DESCONOCIDO: 'DESCONOCIDO',
} as const
export type Tolerancia = (typeof Tolerancia)[keyof typeof Tolerancia]

@Entity()
export class Caracteristica extends BaseEntity {
  @Enum(() => Object.values(Energia))
  energia!: Energia

  // Texto libre: no se presta a una lista cerrada (cada animal es distinto).
  @Property({ nullable: false })
  caracter!: string

  @Enum(() => Object.values(Tamanio))
  tamanio!: Tamanio

  // vacunacion y castracion son booleanos porque representan dos estados posibles.
  @Property({ nullable: false })
  vacunacion!: boolean

  @Property({ nullable: false })
  castracion!: boolean

  @Enum(() => Object.values(Tolerancia))
  toleraNinos!: Tolerancia

  @Enum(() => Object.values(Tolerancia))
  toleraAnimales!: Tolerancia

  @Enum(() => Object.values(Tolerancia))
  toleraEncierro!: Tolerancia

  // Se utiliza text para permitir observaciones largas (varchar limita a 255)
  @Property({ nullable: true, columnType: 'text' })
  observacionesAdicionales?: string
}