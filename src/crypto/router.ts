import express, { Request, Response } from 'express'

import * as CryptoController from './controllers'
import { isPeriod, isResolution } from './helpers'
import { Candlestick } from '../lib/finnhub'

export const cryptoRouter = express.Router()

cryptoRouter.get('/ohlc', async (req: Request, res: Response) => {
  try {
    const { ticker, period, resolution } = req.query
    if (typeof ticker !== 'string') {
      throw new Error(`Query param 'ticker' has to be of type string: ${ticker}`)
    }
    if (typeof period !== 'string' || !isPeriod(period)) {
      throw new Error(`Query param 'period' is not a supported period: ${period}`)
    }
    if (typeof resolution !== 'string' || !isResolution(resolution)) {
      throw new Error(`Query param 'resolution' is not a supported resolution: ${resolution}`)
    }

    const candlesticks: Candlestick[] = await CryptoController.getCandlesticks(ticker, period, resolution)
    if (candlesticks) {
      return res.status(200).json({
        success: true,
        data: candlesticks,
      })
    }
    res.status(404).json({
      success: false,
      message: 'No candlesticks found',
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})
