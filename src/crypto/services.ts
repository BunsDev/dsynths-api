import Client, { Candlestick, Resolution } from '../lib/finnhub'

export const fetchCandlesticks = async (
  ticker: string,
  from: number,
  to: number,
  resolution: Resolution
): Promise<Candlestick[]> => {
  try {
    return await Client.getCryptoCandles(ticker, from, to, resolution)
  } catch (err) {
    throw err
  }
}
