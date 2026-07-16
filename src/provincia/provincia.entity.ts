import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

@Entity()
export class Provincia extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string

  @Property({ nullable: false, unique: true })
  codigo!: string
}