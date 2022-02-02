import dayjs from '../services/day'
import { Period, Range } from '../interface.ts'
import { Resolution } from '../lib/finnhub'

export function isPeriod(value: string = ''): value is Period {
  switch (value) {
    case 'd':
    case 'w':
    case 'm':
    case 'y':
      return true
    default:
      return false
  }
}

export function isResolution(value: string = ''): value is Resolution {
  switch (value) {
    case '1':
    case '5':
    case '15':
    case '30':
    case '60':
    case 'D':
    case 'W':
      return true
    default:
      return false
  }
}

export const resolutionDelta: Record<Resolution, number> = {
  '1': 1 * 60,
  '5': 5 * 60,
  '15': 15 * 60,
  '30': 30 * 60,
  '60': 60 * 60,
  D: 24 * 60 * 60,
  W: 7 * 24 * 60 * 60,
}

export function constructRange(period: Period): Range {
  const to = dayjs().utc().endOf('day').unix() - 1
  let result: Range

  switch (period) {
    case 'd':
      result = {
        from: dayjs().utc().subtract(1, 'day').unix() - 1,
        to,
      }
      break
    case 'w':
      result = {
        from: dayjs().utc().subtract(7, 'days').unix(),
        to,
      }
      break
    case 'm':
      result = {
        from: dayjs().utc().subtract(30, 'days').unix(),
        to,
      }
      break
    case 'y':
      result = {
        from: dayjs().utc().subtract(1, 'year').unix(),
        to,
      }
      break
    default:
      throw new Error(`Unable to construct Range using period: '${period}'`)
  }

  return {
    from: result.from,
    to: result.to,
  }
}
