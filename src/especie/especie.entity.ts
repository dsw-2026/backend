import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

@Entity()
export class Especie extends BaseEntity {
  // unique: true → evita que se registren especies con el mismo nombre en la bd.
  @Property({ nullable: false, unique: true })
  nombre!: string
}