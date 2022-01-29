import { Resolution } from '@stoqey/finnhub'

import { Candlestick } from '../types'
import Client from '../utils/finnhub'
import dayjs from '../utils/day'
import Queue from '../utils/queue'

export const fetchCandlesticks = async (
  ticker: string,
  from: number,
  to: number,
  resolution: Resolution
): Promise<Candlestick[]> => {
  try {
    return await Queue.add(async () => {
      const result = await Client.getCandles(ticker, new Date(from), new Date(to), resolution)
      return result.map((o) => ({
        timestamp: dayjs(o.date).valueOf(),
        open: o.open,
        high: o.high,
        low: o.low,
        close: o.close,
        volume: o.volume,
      })) as Candlestick[]
    })
  } catch (err) {
    throw err
  }
}
