import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Provincia } from '../provincia/provincia.entity.js'

@Entity()
export class Localidad extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: false, unique: true })
  codigoPostal!: string

  @ManyToOne(() => Provincia, { nullable: false })
  provincia!: Rel<Provincia>
}