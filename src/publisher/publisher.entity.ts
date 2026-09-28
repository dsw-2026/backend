import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { User } from '../user/user.entity.js'
import { PublisherType } from './publisher.enums.js'

@Entity({ discriminatorValue: 'publisher' })
export class Publisher extends User {
  @Enum({ items: () => Object.values(PublisherType), nullable: true })
  type?: PublisherType

  @Property({ nullable: true })
  website?: string

  @Property({ nullable: true, columnType: 'json' })
  socialMedia?: Record<string, string>

  @Property({ nullable: true })
  openingHours?: string
}