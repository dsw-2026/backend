import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Province } from '../province/province.entity.js'

@Entity()
export class Locality extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false, unique: true })
  postalCode!: string

  @ManyToOne(() => Province, { nullable: false })
  province!: Rel<Province>
}