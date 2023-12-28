import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import incomeRoutes from './routes/income.routes.js'
import spentRoutes from './routes/spent.routes.js'

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
app.use("/api/spent", spentRoutes)
app.use("/api/income", incomeRoutes)
/* --------------------------------- EXPORT --------------------------------- */
export default app
