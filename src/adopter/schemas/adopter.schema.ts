import { z } from 'zod'
import { HousingType } from '../adopter.enums.js'

const adopterBaseFields = {

  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  email: z.string().email('El email no es válido'),
  phone: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  locality: z.coerce.number().int().positive().optional(),
  profilePhoto: z.string().optional(),
  occupation: z.string().optional(),
  housingType: z.enum(HousingType).optional(),
  hasYard: z.boolean().optional(),
  hasOtherAnimals: z.boolean().optional(),
  otherAnimalsDetail: z.string().optional(),
}

export const createAdopterSchema = z.object({
  body: z.object(adopterBaseFields),
})

export const updateAdopterSchema = z.object({
  body: z.object(adopterBaseFields).partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateAdopterDto = z.infer<typeof createAdopterSchema>['body']
export type UpdateAdopterDto = z.infer<typeof updateAdopterSchema>['body']