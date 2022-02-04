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
 * @param open open price
 * @param high highest price in resolution
 * @param low lowest price in resolution
 * @param close closing price at timestamp
 * @param volume volume of the base asset
 */
export interface Candlestick {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface FinnhubQuote {
  t: number
  o: number
  h: number
  l: number
  c: number
  pc: number
  d: number
  dp: number
}

/**
 * @param timestamp UNIX timestamp at previous candlestick close, in seconds
 * @param open open daily price
 * @param high highest daily price
 * @param low lowest daily price
 * @param close previous closing price
 * @param current current price
 * @param change 24h change in percentage
 */
export interface Quote {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  current: number
  change: number
}
