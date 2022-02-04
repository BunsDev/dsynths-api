const redis = require('redis')
const asyncRedis = require('async-redis')

let config =
  process.env.NODE_ENV === 'production' && process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL,
        socket: {
          tls: true,
          rejectUnauthorized: false,
        },
      }
    : null

const client = redis.createClient(config)

if (process.env.NODE_ENV === 'production') {
  client.config('SET', 'appendOnly', 'yes')
}

client.on('error', (error: Error) => {
  console.error('Redis error encountered: ', error)
})

client.on('connect', () => {
  console.log('Redis connection established')
})

export const redisClient = asyncRedis.decorate(client)
