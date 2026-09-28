import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Locality } from '../locality/locality.entity.js'

// Clase base abstracta de la jerarquía de usuarios (Single Table
// Inheritance). Publisher, Adopter y Admin heredan de ella. La columna
// discriminadora 'userType' distingue el tipo de cada fila.
@Entity({ discriminatorColumn: 'userType', abstract: true })
export class User extends BaseEntity {
  @Property({ nullable: false, unique: true })
  username!: string

  @Property({ nullable: false })
  firstName!: string

  @Property({ nullable: false })
  lastName!: string

  // hidden: true → nunca se incluye en las respuestas JSON (seguridad).
  @Property({ nullable: false, hidden: true })
  password!: string

  @Property({ nullable: false, unique: true })
  email!: string

  @Property({ nullable: true })
  phone?: string

  @Property({ nullable: true })
  description?: string

  @Property({ nullable: true })
  address?: string

  @ManyToOne(() => Locality, { nullable: true })
  locality?: Rel<Locality>

  @Property({ nullable: false, default: false })
  verified!: boolean

  @Property({ nullable: true })
  profilePhoto?: string

  @Property({ nullable: false, onCreate: () => new Date() })
  createdAt!: Date

  @Property({ nullable: true })
  deletedAt?: Date
}