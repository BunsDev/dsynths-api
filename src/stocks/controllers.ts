import { Period } from '../interface.ts'
import { constructRange } from './helpers'
import { fetchCandlesticks } from './services'
import { redisClient } from '../services/redis'
import { Resolution, Candlestick } from '../lib/finnhub'
import { CACHE_EXPIRE_STOCKS_SEC } from '../config'

export async function getCandlesticks(ticker: string, period: Period, resolution: Resolution): Promise<Candlestick[]> {
  const cache = await redisClient.get(`stocks/${ticker}/${period}/${resolution}`)
  const { from, to } = constructRange(period)

  const setCache = (candlesticks: Candlestick[]) => {
    if (!candlesticks.length) return
    redisClient.set(
      `stocks/${ticker}/${period}/${resolution}`,
      JSON.stringify(candlesticks),
      'EX',
      CACHE_EXPIRE_STOCKS_SEC
    )
  }

  if (!cache) {
    const candlesticks = await fetchCandlesticks(ticker, from, to, resolution)
    setCache(candlesticks)
    return candlesticks
  }

  return JSON.parse(cache)
}

// export async function getCandlesticks(ticker: string, period: Period, resolution: Resolution): Promise<Candlestick[]> {
//   const cachedTimestamp = await redisClient.get(`stock/${ticker}/${period}/${resolution}/timestamp`)
//   const { from, to } = constructRange(period)

//   const setCache = (candlesticks: Candlestick[]) => {
//     if (!candlesticks.length) return

//     redisClient.set(
//       `stock/${ticker}/${period}/${resolution}/timestamp`,
//       candlesticks[candlesticks.length - 1].timestamp,
//       'EX',
//       resolutionDelta[resolution]
//     )
//     redisClient.set(
//       `stock/${ticker}/${period}/${resolution}/data`,
//       JSON.stringify(candlesticks),
//       'EX',
//       resolutionDelta[resolution]
//     )
//   }

//   if (!cachedTimestamp) {
//     const candlesticks = await fetchCandlesticks(ticker, from, to, resolution)
//     setCache(candlesticks)
//     return candlesticks
//   }

//   // cachedTimestamp is the `open` time of a candlestick
//   const offset = cachedTimestamp + resolutionDelta[resolution]

//   if (to < offset) {
//     let cachedData = await redisClient.get(`stock/${ticker}/${period}/${resolution}/data`)
//     return JSON.parse(cachedData)
//   }

//   const candlesticks = await fetchCandlesticks(ticker, from, to, resolution)
//   setCache(candlesticks)
//   return candlesticks
// }
