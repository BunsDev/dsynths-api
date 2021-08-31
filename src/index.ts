import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import redis from 'redis'

// controllers
import pricesHandler from './api/prices'

const BACKEND_PORT = 5000
const app = express()
const redisClient = redis.createClient()

const origin = [...(process.env.CORS_URLS || '*').split(',')]
app.use(
  cors({
    origin,
    // for now we don't want other methods but make sure to place only those which we only intend to use from client
    methods: ['GET' /* ,'POST','DELETE','UPDATE','PUT','PATCH' */],
  }),
)

app.get('/', (_, res) => {
  res.status(200).send({ hello: 'world' })
})

app.get('/prices', (req, res) => pricesHandler(req, res, redisClient))

app.listen(BACKEND_PORT, () => console.log(`Running on port ${BACKEND_PORT}`))
