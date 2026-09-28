import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Locality } from '../locality/locality.entity.js'

@Entity({ discriminatorColumn: 'tipoUsuario', abstract: true })
export class Usuario extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombreUsuario!: string

  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: false })
  apellido!: string

  @Property({ nullable: false, hidden: true })
  contrasena!: string

  @Property({ nullable: false, unique: true })
  email!: string

  @Property({ nullable: true })
  telefono?: string

  @Property({ nullable: true })
  descripcion?: string

  @Property({ nullable: true })
  direccion?: string

@ManyToOne(() => Locality, { nullable: true })
localidad?: Rel<Locality>

  @Property({ nullable: false, default: false })
  verificacion!: boolean

  @Property({ nullable: true })
  fotoPerfil?: string

  @Property({ nullable: false, onCreate: () => new Date() })
  fechaCreacion!: Date

  @Property({ nullable: true })
  fechaBaja?: Date
}