import { z } from 'zod'

export const uploadFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif'], {
    message: 'Formato no permitido. Solo JPG, PNG, WEBP o GIF.',
  }),
  size: z.number().max(5 * 1024 * 1024, 'La imagen supera el límite de 5 MB'),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
})

export type UploadFileDto = z.infer<typeof uploadFileSchema>