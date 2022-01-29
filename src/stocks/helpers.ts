import dayjs from '../utils/day'
import { Period, Range, Resolution } from '../types'

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
  '1': 1 * 60 * 1000,
  '5': 5 * 60 * 1000,
  '15': 15 * 60 * 1000,
  '30': 30 * 60 * 1000,
  '60': 60 * 60 * 1000,
  D: 24 * 60 * 60 * 1000,
  W: 7 * 24 * 60 * 60 * 1000,
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
    from: result.from * 1000,
    to: result.to * 1000,
  }
}
