// @ts-ignore
import * as finnhub from 'finnhub';

export interface FinnhubData {
  s: string;
  t: Number[];
  l: Number[];
  h: Number[];
  o: Number[];
  c: Number[];
  v: Number[];
}

const API_KEY = process.env.FINNHUB_API_KEY;
const MISSING_KEY_ERROR = !API_KEY
  ? 'Finnhub API Key is missing. You can get a free one at: https://finnhub.io/. You can continue without one, but it is recommended to create one regardless'
  : null;

finnhub.ApiClient.instance.authentications['api_key'].apiKey = API_KEY;
const finnhubClient = new finnhub.DefaultApi();

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

export const getStockSymbols = async () => {
  try {
    return new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR);
      finnhubClient.stockSymbols('US', (error: Error, data: FinnhubData) => {
        if (error) reject(error);
        resolve(data);
      });
    }).catch((err) => {
      throw err;
    });
  } catch (err) {
    console.info('Error fetching stock symbols:');
    console.error(err);
    return [];
  }
};

export const getStockCandles = async (
  symbol: string,
  resolution: string,
  from: number,
  to: number,
) => {
  try {
    const interval = intervalMapping[resolution];
    if (!interval)
      throw new Error(`Invalid resolution provided: ${resolution}`);

    const data: FinnhubData = await new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR);
      finnhubClient.stockCandles(
        symbol,
        interval,
        from,
        to,
        (error: Error, data: FinnhubData /* response */) => {
          if (error) reject(error);
          resolve(data);
        },
      );
    });

    if (data.s === 'no_data' || data.s !== 'ok') {
      console.info(
        '[data] has returned 0 values for the requested range, this is either a bug or the requested dataset is out of range:',
      );
      console.info(data);
      return [];
    }

    return reduceDataResponse(data, from, to);
  } catch (err) {
    console.info('Error fetching stock candles:');
    console.error(err);
    return [];
  }
};

type StockCandle = {
  time: Number;
  low: Number;
  high: Number;
  open: Number;
  close: Number;
  volume: Number;
};
const reduceDataResponse = (data: FinnhubData, from: Number, to: Number) => {
  try {
    return data.t.reduce((acc: StockCandle[], bar: number, index) => {
      if (bar <= from && bar > to) return acc;
      const obj: StockCandle = {
        time: bar * 1000,
        low: data.l[index],
        high: data.h[index],
        open: data.o[index],
        close: data.c[index],
        volume: data.v[index],
      };
      acc.push(obj);
      return acc;
    }, []);
  } catch (err) {
    console.info('Error reducing data response: ');
    console.error(err);
    return [];
  }
};
