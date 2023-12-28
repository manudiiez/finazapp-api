import { z } from 'zod'

export const createSpentSchema = z.object({
    user_id: z.any({
        required_error: 'Usuario requerido'
    }),
    description: z.string().optional(),
    amount: z.number({
        required_error: "Monto necesario"
    }).optional(),
    date: z.string().datetime().optional(),
    category_id: z.any({
        required_error: 'Categoria requerida'
    })

})