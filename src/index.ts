import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pricesHandler from './api/prices';

const app = express();
const port = 5000;

app.use(
  cors({
    origin: [...(process.env.CORS_URLS || '*').split(',')],
    // for now we don't want other methods but make sure to place only those which we only intend to use from client
    methods: ['GET' /* ,'POST','DELETE','UPDATE','PUT','PATCH' */],
  }),
);

app.get('/', (_, res) => {
  res.status(200).send({ hello: 'world' });
});

// TODO: add api endpoint to get line charts
// 1. make sure we get correct data
// 2. cache them based on the time period requested
app.get('/prices', pricesHandler);

app.listen(port, () => console.log(`Running on port ${port}`));
