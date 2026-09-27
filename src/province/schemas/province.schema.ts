import { z } from 'zod'

export const createProvinceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    code: z.string().min(1, 'El código es obligatorio'),
  }),
})

export const updateProvinceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es obligatorio').optional(),
    code: z.string().min(1, 'El código es obligatorio').optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreateProvinceDto = z.infer<typeof createProvinceSchema>['body']
export type UpdateProvinceDto = z.infer<typeof updateProvinceSchema>['body']