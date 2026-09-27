import { z } from 'zod'

export const createSpeciesSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
  }),
})

export const updateSpeciesSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es obligatorio').optional(),
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

export type CreateSpeciesDto = z.infer<typeof createSpeciesSchema>['body']
export type UpdateSpeciesDto = z.infer<typeof updateSpeciesSchema>['body']