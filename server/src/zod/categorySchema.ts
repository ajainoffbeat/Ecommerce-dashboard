import {z} from 'zod'

export const categorySchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(10).max(500).optional(),
})

export const updateCategorySchema = z.object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().min(10).max(500).optional(),
})