export type Resolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W'

export interface FinnhubCandles {
  c: number[]
  h: number[]
  l: number[]
  o: number[]
  s: string
  t: number[]
  v: number[]
}

/**
 * @param timestamp UNIX timestamp at candlestick open, in seconds
 * @param low lowest price in resolution
 * @param high highest price in resolution
 * @param open open price
 * @param close closing price at timestamp
 * @param volume volume of the base asset
 */
export interface Candlestick {
  timestamp: number
  low: number
  high: number
  open: number
  close: number
  volume: number
}
