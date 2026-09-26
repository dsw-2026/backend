import { Entity, Property, Enum, ManyToOne, OneToOne } from '@mikro-orm/decorators/legacy'
import { Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Species } from '../species/species.entity.js'
import { Publicador } from '../publicador/publicador.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'
import { EstadoMascota } from './estadoMascota.js'

export const Sexo = { MACHO: 'MACHO', HEMBRA: 'HEMBRA' } as const
export type Sexo = (typeof Sexo)[keyof typeof Sexo]

export const UnidadEdad = { MESES: 'MESES', ANIOS: 'ANIOS' } as const
export type UnidadEdad = (typeof UnidadEdad)[keyof typeof UnidadEdad]

export { EstadoMascota }

@Entity()
export class Mascota extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Enum(() => Object.values(Sexo))
  sexo!: Sexo

  @Property({ nullable: false })
  edad!: number

  @Enum(() => Object.values(UnidadEdad))
  unidadEdad!: UnidadEdad

  @Enum(() => Object.values(EstadoMascota))
  estado!: EstadoMascota

  @Property({ nullable: false, onCreate: () => new Date() })
  fechaIngreso!: Date

  @Property({ nullable: true })
  foto?: string

  @ManyToOne(() => Species, { nullable: false })
  species!: Rel<Species>

  @ManyToOne(() => Publicador, { nullable: false })
  publicador!: Rel<Publicador>

  @OneToOne(() => Caracteristica, { nullable: false, cascade: [Cascade.ALL] })
  caracteristica!: Rel<Caracteristica>
}