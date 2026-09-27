import { z } from 'zod'

export const createProvinceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
})

export const updateProvinceSchema = createProvinceSchema.partial()

export type CreateProvinceDto = z.infer<typeof createProvinceSchema>
export type UpdateProvinceDto = z.infer<typeof updateProvinceSchema>