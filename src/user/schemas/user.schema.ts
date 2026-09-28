import { z } from 'zod'

const userBaseFields = {
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
}

export const createUserSchema = z.object({
  body: z.object(userBaseFields),
})

export const updateUserSchema = z.object({
  body: z.object(userBaseFields).partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateUserDto = z.infer<typeof createUserSchema>['body']
export type UpdateUserDto = z.infer<typeof updateUserSchema>['body']