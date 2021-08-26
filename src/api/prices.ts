import { Request, Response } from 'express';
import { getStockCandles } from '../utils/stocks';

const pricesHandler = async (req: Request, res: Response) => {
  const { symbol, resolution, from, to } = req.query;
  const stockCandles = await getStockCandles(
    symbol as string,
    resolution as string,
    parseInt(from as string),
    parseInt(to as string),
  );
  res.status(200).send(stockCandles);
};

export default pricesHandler;
