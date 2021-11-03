import { Request, Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import type { RedisClient } from 'redis';

import { getStockCandles, StockCandle } from '../utils/stocks.js';

dayjs.extend(utc);
type Resolution = '15' | '60' | 'D';
const resolutionTimestampDelta: Record<Resolution, number> = {
  15: 15 * 60,
  60: 60 * 60,
  D: 24 * 60 * 60,
};

type Params = {
  to: number;
  from: number;
  resolution: Resolution;
};
const getParams = (timeframe: string) => {
  const to = dayjs().utc().endOf('day').unix() - 1;
  let result: Params;

  switch (timeframe) {
    case 'd':
      result = {
        resolution: '15',
        from: dayjs().utc().subtract(1, 'day').unix() - 1,
        to,
      };
      break;
    case 'w':
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(7, 'days').unix(),
        to,
      };
      break;
    case 'm':
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(30, 'days').unix(),
        to,
      };
      break;
    case 'y':
      result = {
        resolution: 'D',
        from: dayjs().utc().subtract(1, 'year').unix(),
        to,
      };
      break;
    default:
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(1, 'day').unix(),
        to,
      };
  }
  return result;
};

const pricesHandler = async (
  req: Request,
  res: Response,
  redisClient: RedisClient,
): Promise<void> => {
  const fetchStockCandlesAndSendData = async () => {
    getStockCandles(symbol as string, resolution as string, from, to, assetType as string).then(
      (stockCandles) => {
        res.json(stockCandles);
        redisClient.set(
          `${assetType}/${symbol}/${timeframe}/lastCandleTimestamp`,
          stockCandles[stockCandles.length - 1].time.toString(),
          'EX',
          resolutionTimestampDelta[resolution],
        );
        redisClient.set(
          `${assetType}/${symbol}/${timeframe}/data`,
          JSON.stringify(stockCandles),
          'EX',
          resolutionTimestampDelta[resolution],
        );
        console.log('Redis Cache set:', [
          `${assetType}/${symbol}/${timeframe}/lastCandleTimestamp`,
          `${assetType}/${symbol}/${timeframe}/data`,
        ]);
      },
    );
  };

  const { assetType, symbol, timeframe } = req.query;
  const { to, from, resolution } = getParams(timeframe as string);
  // check the cache if we have valid data for the period
  redisClient.get(
    `${assetType}/${symbol}/${timeframe}/lastCandleTimestamp`,
    (err, lastCandleTimestampData) => {
      if (!err) {
        const lastCandleTimestamp = parseInt(lastCandleTimestampData) / 1000;
        const offsetTime = to + resolutionTimestampDelta[resolution];
        if (lastCandleTimestamp < offsetTime) {
          redisClient.get(`${assetType}/${symbol}/${timeframe}/data`, (err, data) => {
            if (!err) {
              console.log('Cached data found');
              const cachedData: StockCandle[] = JSON.parse(data);
              res.json(cachedData);
            }
            return;
          });
          return;
        }
      }
      console.log('No Cache Data');
      fetchStockCandlesAndSendData();
      return;
    },
  );
};

export default pricesHandler;
