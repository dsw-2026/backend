import { z } from 'zod'
import { EnergyLevel, Size, Tolerance } from '../../characteristic/characteristic.enums.js'

export const createApplicationSchema = z.object({
  body: z.object({
    message: z.string().optional(),
    pet: z.coerce.number().int().positive('La mascota es obligatoria'),
    desiredEnergyLevel: z.enum(EnergyLevel),
    desiredSize: z.enum(Size),
    desiredToleratesChildren: z.enum(Tolerance),
    desiredToleratesOtherAnimals: z.enum(Tolerance),
    desiredToleratesConfinement: z.enum(Tolerance),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>['body']