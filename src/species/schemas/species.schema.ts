import { z } from 'zod'

export const createSpeciesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const updateSpeciesSchema = createSpeciesSchema.partial()

export type CreateSpeciesDto = z.infer<typeof createSpeciesSchema>
export type UpdateSpeciesDto = z.infer<typeof updateSpeciesSchema>