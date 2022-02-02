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
