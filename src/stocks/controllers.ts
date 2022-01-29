import { Resolution, Period, Candlestick } from '../types'
import { constructRange, resolutionDelta } from './helpers'
import { fetchCandlesticks } from './services'
import { redisClient } from '../utils/redis'

export async function getCandlesticks(ticker: string, period: Period, resolution: Resolution): Promise<Candlestick[]> {
  const cachedTimestamp = await redisClient.get(`stock/${ticker}/${period}/${resolution}/timestamp`)
  const { from, to } = constructRange(period)

  const setCache = (candlesticks: Candlestick[]) => {
    redisClient.set(
      `stock/${ticker}/${period}/${resolution}/timestamp`,
      candlesticks[candlesticks.length - 1].timestamp,
      'EX',
      resolutionDelta[resolution]
    )
    redisClient.set(
      `stock/${ticker}/${period}/${resolution}/data`,
      JSON.stringify(candlesticks),
      'EX',
      resolutionDelta[resolution]
    )
  }

  if (!cachedTimestamp) {
    const candlesticks = await fetchCandlesticks(ticker, from, to, resolution)
    setCache(candlesticks)
    return candlesticks
  }

  const offset = to + resolutionDelta[resolution]

  if (cachedTimestamp < offset) {
    let cachedData = await redisClient.get(`stock/${ticker}/${period}/${resolution}/data`)
    return JSON.parse(cachedData)
  }

  const candlesticks = await fetchCandlesticks(ticker, from, to, resolution)
  setCache(candlesticks)
  return candlesticks
}
