import { Entity, Property, Enum, ManyToOne, OneToOne } from '@mikro-orm/decorators/legacy'
import { Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Especie } from '../especie/especie.entity.js'
import { Publicador } from '../publicador/publicador.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'

export enum Sexo {
  MACHO = 'MACHO',
  HEMBRA = 'HEMBRA',
}

export enum UnidadEdad {
  MESES = 'MESES',
  ANIOS = 'ANIOS',
}

export enum EstadoMascota {
  DISPONIBLE = 'DISPONIBLE',
  EN_PROCESO = 'EN_PROCESO',
  ADOPTADA = 'ADOPTADA',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
}

@Entity()
export class Mascota extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Enum(() => Sexo)
  sexo!: Sexo

  @Property({ nullable: false })
  edad!: number

  @Enum(() => UnidadEdad)
  unidadEdad!: UnidadEdad

  @Enum(() => EstadoMascota)
  estado!: EstadoMascota

  @Property({ nullable: false, onCreate: () => new Date() })
  fechaIngreso!: Date

  @Property({ nullable: true })
  foto?: string

  @ManyToOne(() => Especie, { nullable: false })
  especie!: Rel<Especie>

  @ManyToOne(() => Publicador, { nullable: false })
  publicador!: Rel<Publicador>

  @OneToOne(() => Caracteristica, { nullable: false, cascade: [Cascade.ALL] })
  caracteristica!: Rel<Caracteristica>
}