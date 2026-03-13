import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
