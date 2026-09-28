import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { User } from '../user/user.entity.js'
import { HousingType } from './adopter.enums.js'

@Entity({ discriminatorValue: 'adopter' })
export class Adopter extends User {
  @Property({ nullable: true })
  occupation?: string

  @Enum({ items: () => Object.values(HousingType), nullable: true })
  housingType?: HousingType

  @Property({ nullable: true })
  hasYard?: boolean

  @Property({ nullable: true })
  hasOtherAnimals?: boolean

  @Property({ nullable: true })
  otherAnimalsDetail?: string
}