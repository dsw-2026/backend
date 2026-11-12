import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'El email es obligatorio').email('El email no es válido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  }),
})

export type LoginDto = z.infer<typeof loginSchema>['body']