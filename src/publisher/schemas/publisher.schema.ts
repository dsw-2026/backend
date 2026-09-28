import { z } from 'zod'
import { PublisherType } from '../publisher.enums.js'

const publisherBaseFields = {
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
  // Propios de Publisher:
  type: z.enum(PublisherType).optional(),
  website: z.string().optional(),
  socialMedia: z.record(z.string(), z.string()).optional(),
  openingHours: z.string().optional(),
}

export const createPublisherSchema = z.object({
  body: z.object(publisherBaseFields),
})

export const updatePublisherSchema = z.object({
  body: z.object(publisherBaseFields).partial(),
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('El ID no es válido'),
  }),
})

export type CreatePublisherDto = z.infer<typeof createPublisherSchema>['body']
export type UpdatePublisherDto = z.infer<typeof updatePublisherSchema>['body']