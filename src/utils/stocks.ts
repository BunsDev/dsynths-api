// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as finnhub from 'finnhub'
import { RateLimiterQueue } from './Queue.js'
import fetch from 'node-fetch'

export interface FinnhubData {
  s: string
  t: number[]
  l: number[]
  h: number[]
  o: number[]
  c: number[]
  v: number[]
}
export type CoinGeckoData = Array<[number, number, number, number, number]>
export interface StockCandle {
  time: number
  low: number
  high: number
  open: number
  close: number
  volume?: number
}
interface StockSymbols {
  currency?: string
  description?: string
  displaySymbol?: string
  figi?: string
  mic?: string
  symbol?: string
  type?: string
}

// prettier-ignore
export const intervalMapping: Record<string, string> = {
  // tradingview_identifier: finnhub_identifier
  '1m': '1',
  '1': '1',
  '5': '5',
  '5m': '5',
  '15': '15',
  '15m': '15',
  '30': '30',
  '30m': '30',
  '60': '60',
  '60m': '60',
  'D': 'D',
  '1D': 'D',
  'W': 'W',
  '1W': 'W',
  'M': 'M',
  '1M': 'M',
};

let finnhubClient: finnhub = null;
const MISSING_KEY_ERROR =  'Finnhub API Key is missing. You can get a free one at: https://finnhub.io/. You can continue without one, but it is recommended to create one regardless'
const initialiseFinnhubClient = () => {
  if (finnhubClient) return finnhubClient
  const API_KEY = process.env.FINNHUB_API_KEY
  if (!API_KEY) {
    console.error(MISSING_KEY_ERROR)
  }
  finnhub.ApiClient.instance.authentications['api_key'].apiKey = API_KEY
  finnhubClient = new finnhub.DefaultApi()
  return finnhubClient
}

export const getStockSymbols = async (): Promise<
  StockSymbols[] | StockSymbols
> => {
  try {
    if (!finnhubClient) initialiseFinnhubClient()

    return await new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR)
      RateLimiterQueue.add(() =>
        finnhubClient.stockSymbols(
          'US',
          (error: Error, data: StockSymbols | StockSymbols[]) => {
            if (error) reject(error)
            resolve(data)
          },
        ),
      )
    }).catch((err) => {
      throw err
    })
  } catch (err) {
    console.info('Error fetching stock symbols:')
    console.error(err)
  }
  return []
}

const reduceFinnhubDataResponse = (
  data: FinnhubData,
  from: number,
  to: number,
) => {
  try {
    return data.t.reduce((acc: StockCandle[], bar: number, index) => {
      if (bar <= from && bar > to) return acc
      const obj: StockCandle = {
        time: bar * 1000,
        low: data.l[index],
        high: data.h[index],
        open: data.o[index],
        close: data.c[index],
        volume: data.v[index],
      }
      acc.push(obj)
      return acc
    }, [])
  } catch (err) {
    console.info('Error reducing data response: ')
    console.error(err)
    return []
  }
}

const getStockPrices = async (
  symbol: string,
  interval: string,
  from: number,
  to: number,
): Promise<StockCandle[]> => {
  if (!finnhubClient) initialiseFinnhubClient()

  const data: FinnhubData = await new Promise((resolve, reject) => {
    RateLimiterQueue.add(() =>
      finnhubClient.stockCandles(
        symbol,
        interval,
        from,
        to,
        (error: Error, data: FinnhubData) => {
          if (error) reject(error)
          resolve(data)
        },
      ),
    )
  })
  if (data.s === 'no_data' || data.s !== 'ok') {
    console.info(
      '[data] has returned 0 values for the requested range, this is either a bug or the requested dataset is out of range:',
    )
    console.info(data)
    return []
  }
  return reduceFinnhubDataResponse(data, from, to)
}

const getCoinGeckoData = async (symbol: string, from: number, to: number) => {
  const getDaysFromRange = (from: number, to: number) => {
    const diff = Math.floor((to - from) / (60 * 60 * 24))
    if (diff < 1) return 1
    if (diff > 365) return 365
    return diff
  }
  const getIDFromSymbol = async (symbol: string) => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list')
    const coinsList = await response.json()
    const symbolToSearch = symbol.toLowerCase()
    const { id } = (
      coinsList as Array<{ symbol: string; id: string; name: string }>
    ).find((coin: { symbol: string }) => coin.symbol === symbolToSearch)
    return id
  }
  const id = await getIDFromSymbol(symbol)
  console.info(
    `Fetching data for ${symbol}-${id} from ${from} to ${to} (${getDaysFromRange(
      from,
      to,
    )})`,
  )
  const candlesData = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${getDaysFromRange(
      from,
      to,
    )}`,
  )
  const candlesJson = await candlesData.json()
  return candlesJson as CoinGeckoData
}

const reduceCoinGeckoDataResponse = (
  data: CoinGeckoData,
) => {
  try {
    return data.reduce(
      (acc: StockCandle[], dataChunk: Array<number>) => {
        const [time, open, high, low, close] = dataChunk
        const obj: StockCandle = {
          time,
          open,
          high,
          low,
          close,
        }
        acc.push(obj)
        return acc
      },
      [],
    )
  } catch (err) {
    console.info('Error reducing data response: ')
    console.error(err)
    return []
  }
}

const getCryptoPrices = async (symbol: string, from: number, to: number) : Promise<StockCandle[]> => {
  const data: CoinGeckoData = await new Promise((resolve, reject) => {
    RateLimiterQueue.add(() =>
      getCoinGeckoData(symbol, from, to)
        .then((data) => resolve(data))
        .catch((err) => reject(err)),
    )
  })
  if (!data.length) {
    console.info(
      '[data] has returned 0 values for the requested range, this is either a bug or the requested dataset is out of range:',
    )
    console.info(data)
    return []
  }
  return reduceCoinGeckoDataResponse(data)
}

export const getStockCandles = async (
  symbol: string,
  resolution: string,
  from: number,
  to: number,
  assetType: string,
): Promise<StockCandle[]> => {
  console.log({ symbol, assetType })
  try {
    const interval = intervalMapping[resolution]
    if (!interval) {
      throw new Error(`Invalid resolution provided: ${resolution}`)
    }

    if (assetType === 'CRYPTO') {
      return await getCryptoPrices(symbol, from, to)
    }
    return await getStockPrices(symbol, interval, from, to)
  } catch (err) {
    console.info('Error fetching stock candles:')
    console.error(err)
    return []
  }
}
