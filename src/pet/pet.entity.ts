import { Entity, Property, Enum, ManyToOne, OneToOne } from '@mikro-orm/decorators/legacy'
import { Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Species } from '../species/species.entity.js'
import { Publisher } from '../publisher/publisher.entity.js'
import { Characteristic } from '../characteristic/characteristic.entity.js'
import { Sex, AgeUnit, PetStatus } from './pet.enums.js'

@Entity()
export class Pet extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Enum(() => Object.values(Sex))
  sex!: Sex

  @Property({ nullable: false })
  age!: number

  @Enum(() => Object.values(AgeUnit))
  ageUnit!: AgeUnit

  @Enum(() => Object.values(PetStatus))
  status!: PetStatus

  @Property({ nullable: false, onCreate: () => new Date() })
  admissionDate!: Date

  @Property({ nullable: true })
  photo?: string

  @ManyToOne(() => Species, { nullable: false })
  species!: Rel<Species>

  @ManyToOne(() => Publisher, { nullable: false })
  publisher!: Rel<Publisher>

  @OneToOne(() => Characteristic, { nullable: false, cascade: [Cascade.ALL] })
  characteristic!: Rel<Characteristic>
}