import { Entity, Property, Enum, ManyToOne } from '@mikro-orm/decorators/legacy'
import { Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/base.entity.js'
import { Pet } from '../pet/pet.entity.js'
import { Adopter } from '../adopter/adopter.entity.js'
import { EnergyLevel, Size, Tolerance } from '../characteristic/characteristic.enums.js'
import { ApplicationStatus } from './application.enums.js'

@Entity()
export class Application extends BaseEntity {
  @Enum({ items: () => Object.values(ApplicationStatus) })
  status!: ApplicationStatus


  @Property({ nullable: false, onCreate: () => new Date() })
  applicationDate!: Date

  @Property({ nullable: true })
  resolutionDate?: Date

  @Property({ nullable: true, columnType: 'text' })
  message?: string

  @Enum({ items: () => Object.values(EnergyLevel) })
  desiredEnergyLevel!: EnergyLevel

  @Enum({ items: () => Object.values(Size) })
  desiredSize!: Size

  @Enum({ items: () => Object.values(Tolerance) })
  desiredToleratesChildren!: Tolerance

  @Enum({ items: () => Object.values(Tolerance) })
  desiredToleratesOtherAnimals!: Tolerance

  @Enum({ items: () => Object.values(Tolerance) })
  desiredToleratesConfinement!: Tolerance

  @ManyToOne(() => Pet, { nullable: false })
  pet!: Rel<Pet>

  @ManyToOne(() => Adopter, { nullable: false })
  adopter!: Rel<Adopter>
}
