import type { Resolution as OriginalResolution } from '@stoqey/finnhub'
export type Resolution = Exclude<OriginalResolution, 'M'> // M causes issues with timestamp delta's

/**
 * Range in time in which the candlesticks are active.
 */
export type Period = 'd' | 'w' | 'm' | 'y'

export interface Range {
  from: number
  to: number
}

export interface Price {
  price: number
  timestamp: number
}

/**
 * @param timestamp UNIX timestamp at candlestick close, MS
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
