import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'

import { stocksRouter } from './stocks/router'
import { errorHandler } from './middleware/error'
import { notFoundHandler } from './middleware/not-found'
import { CORS_WHITELIST } from './config'

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

if (process.env.NODE_ENV === 'production') {
  // app.use(
  //   cors({
  //     origin: function (origin, callback) {
  //       if (!origin || CORS_WHITELIST.indexOf(origin) !== -1) {
  //         callback(null, true)
  //       } else {
  //         callback(new Error('Not allowed by CORS'))
  //       }
  //     },
  //     optionsSuccessStatus: 200, // some legacy browsers (IE11) choke on 204
  //     methods: ['GET'],
  //   })
  // )
}

app.use(express.json())

app.use('/stocks', stocksRouter)
app.use(errorHandler)
app.use(notFoundHandler)
