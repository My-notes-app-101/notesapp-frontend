import { z } from 'zod'

export const CreateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  content: z.string().optional(),
})

export const UpdateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  content: z.string().optional(),
})

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>
