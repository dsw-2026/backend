import { z } from 'zod'
import { Sex, AgeUnit, PetStatus } from '../pet.enums.js'
import { EnergyLevel, Size, Tolerance } from '../../characteristic/characteristic.enums.js'


const petBaseFields = {
  name: z.string().min(1, 'El nombre es obligatorio'),
  sex: z.enum(Sex),
  age: z.coerce.number().int().positive('La edad debe ser un número positivo'),
  ageUnit: z.enum(AgeUnit),
  status: z.enum(PetStatus),
  photo: z.string().optional(),
  species: z.coerce.number().int().positive('La especie es obligatoria'),
  energyLevel: z.enum(EnergyLevel),
  temperament: z.string().min(1, 'El temperamento es obligatorio'),
  size: z.enum(Size),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  toleratesChildren: z.enum(Tolerance),
  toleratesOtherAnimals: z.enum(Tolerance),
  toleratesConfinement: z.enum(Tolerance),
  additionalNotes: z.string().optional(),
}

export const createPetSchema = z.object({
  body: z.object(petBaseFields),
})

export const updatePetSchema = z.object({
  body: z.object(petBaseFields).partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreatePetDto = z.infer<typeof createPetSchema>['body']
export type UpdatePetDto = z.infer<typeof updatePetSchema>['body']