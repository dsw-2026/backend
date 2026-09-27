import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'

@Entity()
export class Province extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string

  @Property({ nullable: false, unique: true })
  code!: string
}