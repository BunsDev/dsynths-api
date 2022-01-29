// import { Request, Response } from 'express'
// import type { RedisClient } from 'redis'

// // import { getStockCandles, StockCandle } from '../utils/stocks'
// import dayjs from '../utils/day'
// import { Resolution, Sector, Period, Range } from '../types'

// export async function pricesHandler(req: Request, res: Response): Promise<void> {
//   const {
//     sector,
//     ticker,
//     period,
//   }: {
//     sector: Sector
//     ticker: string
//     period: Period
//   } = req.query
//   const { to, from, resolution } = constructRange(period)
//   // const result = getStockCandles()
// }

// const fetchStockCandles = async () => {
//   getStockCandles(symbol as string, resolution as string, from, to, assetType as string).then((stockCandles) => {
//     res.json(stockCandles)
//     redisClient.set(
//       `${assetType}/${symbol}/${timeframe}/lastCandleTimestamp`,
//       stockCandles[stockCandles.length - 1].time.toString(),
//       'EX',
//       resolutionTimestampDelta[resolution]
//     )
//     redisClient.set(
//       `${assetType}/${symbol}/${timeframe}/data`,
//       JSON.stringify(stockCandles),
//       'EX',
//       resolutionTimestampDelta[resolution]
//     )
//     console.log('Redis Cache set:', [
//       `${assetType}/${symbol}/${timeframe}/lastCandleTimestamp`,
//       `${assetType}/${symbol}/${timeframe}/data`,
//     ])
//   })
// }
