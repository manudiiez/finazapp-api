import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import goalRoutes from './routes/goal.routes.js'

/* ----------------------------------- APP ---------------------------------- */
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json())
// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/goal", goalRoutes)

/* --------------------------------- EXPORT --------------------------------- */
export default app
