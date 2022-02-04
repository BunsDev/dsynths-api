import axios, { AxiosInstance } from 'axios'

import { Candlestick, FinnhubCandles, Resolution } from './interface'
import Queue from './queue'
import { FINNHUB_API_KEY } from './config'

const round = (num: number) => Math.round(num)

/**
 * FinnhubAPI
 * @StockCandles Get candlestick data for stocks.
 * https://finnhub.io/docs/api#stock-candles
 *
 * @CryptoCandles Get candlestick data for crypto.
 * https://finnhub.io/docs/api#crypto-candles
 *
 */
export class FinnhubAPI {
  public token: string
  public api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://finnhub.io/api/v1',
    })

    this.token = FINNHUB_API_KEY
  }

  /**
   * Get candlestick data for stocks.
   * @param symbol
   * @param from
   * @param to
   * @param resolution
   * https://finnhub.io/docs/api#stock-candles
   */
  public async getStockCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: Resolution
  ): Promise<Candlestick[]> {
    //  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    const params = {
      symbol,
      from: round(from),
      to: round(to),
      resolution,
      token: this.token,
    }

    if (isNaN(from) || isNaN(to)) {
      throw new Error(`Parameters 'from' or 'to' are corrupted: ${from}, ${to}`)
    }

    try {
      const data: FinnhubCandles = await Queue.add(async () => {
        const response = await this.api.get(`stock/candle`, {
          method: 'GET',
          params,
        })
        return await response.data
      })

      if (!('c' in data)) {
        throw new Error('No data found')
      }

      return !data.c.length
        ? []
        : data.c.map((closePrice, index) => {
            const timestamp = data.t[index]
            const open = data.o[index]
            const high = data.h[index]
            const low = data.l[index]
            const close = closePrice
            const volume = data.v[index]
            return {
              timestamp,
              open,
              high,
              low,
              close,
              volume,
            }
          })
    } catch (error: any) {
      console.error('An error occured while fetching candles', error)
      return []
    }
  }

  /**
   * Get candlestick data for crypto.
   * @param symbol
   * @param from
   * @param to
   * @param resolution
   * https://finnhub.io/docs/api#crypto-candles
   */
  public async getCryptoCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: Resolution
  ): Promise<Candlestick[]> {
    //  const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    const params = {
      symbol: `BINANCE:${symbol}USDT`,
      from: round(from),
      to: round(to),
      resolution,
      token: this.token,
    }

    if (isNaN(from) || isNaN(to)) {
      throw new Error(`Parameters 'from' or 'to' are corrupted: ${from}, ${to}`)
    }

    try {
      const data: FinnhubCandles = await Queue.add(async () => {
        const response = await this.api.get(`crypto/candle`, {
          method: 'GET',
          params,
        })
        return await response.data
      })

      if (!('c' in data)) {
        throw new Error('No data found')
      }

      return !data.c.length
        ? []
        : data.c.map((closePrice, index) => {
            const timestamp = data.t[index]
            const open = data.o[index]
            const high = data.h[index]
            const low = data.l[index]
            const close = closePrice
            const volume = data.v[index]
            return {
              timestamp,
              open,
              high,
              low,
              close,
              volume,
            }
          })
    } catch (error: any) {
      console.error('An error occured while fetching candles', error)
      return []
    }
  }
}

export default new FinnhubAPI()
