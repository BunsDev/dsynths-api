import dotenv from 'dotenv'
dotenv.config()

if (!process.env.FINNHUB_API_KEY) {
  console.error('FINNHUB_API_KEY must be a defined environment variable')
  process.exit(1)
}

export const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || ''
