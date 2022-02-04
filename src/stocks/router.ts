import express, { Request, Response } from 'express'

import * as StockController from './controllers'
import { isPeriod, isResolution } from './helpers'
import { Candlestick, Quote } from '../lib/finnhub'

export const stocksRouter = express.Router()

stocksRouter.get('/ohlc', async (req: Request, res: Response) => {
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

    const candlesticks: Candlestick[] = await StockController.getCandlesticks(ticker, period, resolution)
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

stocksRouter.get('/quote', async (req: Request, res: Response) => {
  try {
    const { ticker } = req.query
    if (typeof ticker !== 'string') {
      throw new Error(`Query param 'ticker' has to be of type string: ${ticker}`)
    }

    const quote: Quote | null = await StockController.getQuote(ticker)
    if (quote) {
      return res.status(200).json({
        success: true,
        data: quote,
      })
    }
    res.status(404).json({
      success: false,
      message: 'No quote found',
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})
