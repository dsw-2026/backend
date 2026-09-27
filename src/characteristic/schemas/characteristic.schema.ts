import { z } from 'zod'
import { EnergyLevel, Size, Tolerance } from '../characteristic.enums.js'

export const createCharacteristicSchema = z.object({
  energyLevel: z.enum(EnergyLevel), 
  temperament: z.string().min(1, 'Temperament is required'),
  size: z.enum(Size),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  toleratesChildren: z.enum(Tolerance),
  toleratesOtherAnimals: z.enum(Tolerance),
  toleratesConfinement: z.enum(Tolerance),
  additionalNotes: z.string().optional(),
})

export const updateCharacteristicSchema = createCharacteristicSchema.partial()

export type CreateCharacteristicDto = z.infer<typeof createCharacteristicSchema>
export type UpdateCharacteristicDto = z.infer<typeof updateCharacteristicSchema>
