import { z } from 'zod'

export const createCategorySchema = z.object({
    user: z.any({
        required_error: 'Usuario requerido'
    }).optional(),
    name: z.string({
        required_error: 'Nombre requerido'
    }),
    type: z.string({
        required_error: 'Tipo requerido'
    })
})