import Client, { Candlestick, Quote, Resolution } from '../lib/finnhub'

export const fetchCandlesticks = async (
  ticker: string,
  from: number,
  to: number,
  resolution: Resolution
): Promise<Candlestick[]> => {
  try {
    return await Client.getStockCandles(ticker, from, to, resolution)
  } catch (err) {
    throw err
  }
}

export const fetchQuote = async (ticker: string): Promise<Quote | null> => {
  try {
    return await Client.getStockQuote(ticker)
  } catch (err) {
    throw err
  }
}
