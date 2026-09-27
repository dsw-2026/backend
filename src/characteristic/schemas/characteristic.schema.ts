import { z } from 'zod'
import { EnergyLevel, Size, Tolerance } from '../characteristic.enums.js'

export const createCharacteristicSchema = z.object({
  body: z.object({
    energyLevel: z.enum(EnergyLevel),
    temperament: z.string().min(1, 'El temperamento es obligatorio'),
    size: z.enum(Size),
    vaccinated: z.boolean(),
    neutered: z.boolean(),
    toleratesChildren: z.enum(Tolerance),
    toleratesOtherAnimals: z.enum(Tolerance),
    toleratesConfinement: z.enum(Tolerance),
    additionalNotes: z.string().optional(),
  }),
})

export const updateCharacteristicSchema = z.object({
  body: createCharacteristicSchema.shape.body.partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateCharacteristicDto = z.infer<typeof createCharacteristicSchema>['body']
export type UpdateCharacteristicDto = z.infer<typeof updateCharacteristicSchema>['body']