import { Entity, Property, Enum, ManyToOne, OneToOne } from '@mikro-orm/decorators/legacy'
import { Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Especie } from '../especie/especie.entity.js'
import { Publicador } from '../publicador/publicador.entity.js'
import { Caracteristica } from '../caracteristica/caracteristica.entity.js'
import { EstadoMascota } from './estadoMascota.js'

export const Sexo = { MACHO: 'MACHO', HEMBRA: 'HEMBRA' } as const
export type Sexo = (typeof Sexo)[keyof typeof Sexo]

export const UnidadEdad = { MESES: 'MESES', ANIOS: 'ANIOS' } as const
export type UnidadEdad = (typeof UnidadEdad)[keyof typeof UnidadEdad]

// Re-exportamos EstadoMascota (definido en su propio archivo, sin
// decoradores) para que el resto del proyecto lo siga importando desde
// acá como antes, sin tener que cambiar todos los imports existentes.
export { EstadoMascota }

@Entity()
export class Mascota extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Enum(() => Object.values(Sexo))
  sexo!: Sexo

  // Se separa la edad de su unidad para distinguir, por ejemplo, 2 meses de 2 años.
  @Property({ nullable: false })
  edad!: number

  @Enum(() => Object.values(UnidadEdad))
  unidadEdad!: UnidadEdad

  @Enum(() => Object.values(EstadoMascota))
  estado!: EstadoMascota

  // Se asigna automáticamente al crear la Mascota.
  @Property({ nullable: false, onCreate: () => new Date() })
  fechaIngreso!: Date

  @Property({ nullable: true })
  foto?: string

  @ManyToOne(() => Especie, { nullable: false })
  especie!: Rel<Especie>

  @ManyToOne(() => Publicador, { nullable: false })
  publicador!: Rel<Publicador>

  // La Caracteristica se elimina junto con la Mascota por la cascada configurada.
  @OneToOne(() => Caracteristica, { nullable: false, cascade: [Cascade.ALL] })
  caracteristica!: Rel<Caracteristica>
}