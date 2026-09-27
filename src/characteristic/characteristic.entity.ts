import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../shared/db/base.entity.js'
import { EnergyLevel, Size, Tolerance } from './characteristic.enums.js'

@Entity()
export class Characteristic extends BaseEntity {
  @Enum(() => Object.values(EnergyLevel))
  energyLevel!: EnergyLevel

  @Property({ nullable: false })
  temperament!: string

  @Enum(() => Object.values(Size))
  size!: Size

  @Property({ nullable: false })
  vaccinated!: boolean

  @Property({ nullable: false })
  neutered!: boolean

  @Enum(() => Object.values(Tolerance))
  toleratesChildren!: Tolerance

  @Enum(() => Object.values(Tolerance))
  toleratesOtherAnimals!: Tolerance

  @Enum(() => Object.values(Tolerance))
  toleratesConfinement!: Tolerance

  @Property({ nullable: true, columnType: 'text' })
  additionalNotes?: string
}