import { z } from 'zod'

export const createTransactionSchema = z.object({
    user: z.any({
        required_error: 'Usuario requerido'
    }),
    note: z.string().optional(),
    amount: z.number({
        required_error: "Monto necesario"
    }).optional(),
    date: z.string().datetime().optional(),
    category: z.any({
        required_error: 'Categoria requerida'
    }),
    type: z.string()
})