import { z } from 'zod'

export const createLocalitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    postalCode: z.string().min(1, 'El código postal es obligatorio'),
    province: z.coerce.number().int().positive('La provincia es obligatoria'),
  }),
})

export const updateLocalitySchema = z.object({
  body: createLocalitySchema.shape.body.partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateLocalityDto = z.infer<typeof createLocalitySchema>['body']
export type UpdateLocalityDto = z.infer<typeof updateLocalitySchema>['body']