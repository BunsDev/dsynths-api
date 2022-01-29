import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import { stocksRouter } from './stocks/router'
import { errorHandler } from './middleware/error'
import { notFoundHandler } from './middleware/not-found'

dotenv.config()

if (!process.env.PORT) {
  console.error('PORT must be a defined environment variable')
  process.exit(1)
}

if (!process.env.FINNHUB_API_KEY) {
  console.error('FINNHUB_API_KEY must be a defined environment variable')
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)
const app = express()
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

app.use(helmet())
app.use(
  cors({
    origin: [...(process.env.CORS_WHITELIST || '*').split(',')],
    methods: ['GET'],
  })
)
app.use(express.json())

app.use('/stocks', stocksRouter)
app.use(errorHandler)
app.use(notFoundHandler)
