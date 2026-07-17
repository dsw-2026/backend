import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

export enum Tamanio {
  PEQUENIO = 'PEQUENIO',
  MEDIANO = 'MEDIANO',
  GRANDE = 'GRANDE',
  GIGANTE = 'GIGANTE',
}

export enum Energia {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

export enum Tolerancia {
  SI = 'SI',
  NO = 'NO',
  DESCONOCIDO = 'DESCONOCIDO',
}

@Entity()
export class Caracteristica extends BaseEntity {
  @Enum(() => Energia)
  energia!: Energia

  @Property({ nullable: false })
  caracter!: string

  @Enum(() => Tamanio)
  tamanio!: Tamanio

  @Property({ nullable: false })
  vacunacion!: boolean

  @Property({ nullable: false })
  castracion!: boolean

  @Enum(() => Tolerancia)
  toleraNinos!: Tolerancia

  @Enum(() => Tolerancia)
  toleraAnimales!: Tolerancia

  @Enum(() => Tolerancia)
  toleraEncierro!: Tolerancia

  @Property({ nullable: true, columnType: 'text' })
  observacionesAdicionales?: string
}