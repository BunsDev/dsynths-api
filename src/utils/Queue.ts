import Bottleneck from 'bottleneck';

type Job = () => Promise<never>;
type LimiterConfig = {
  reservoir?: number;
  reservoirRefreshAmount?: number;
  reservoirRefreshInterval?: number;
  maxConcurrent?: number;
  minTime?: number;
};
// Finnhub API rate limits at 300 calls/minute && 30 calls/sec
class Queue {
  private limiter: Bottleneck;

  constructor(config?: LimiterConfig) {
    this.limiter = new Bottleneck(
      config || {
        /**
         * Original MAX values => needed for server-side requests.
         * TODO: build a back-end that does exactly this (for production), essentially
         * removing client-side fetches (so our API KEY doesn't get destroyed)
         */
        reservoir: 300, // 300 per minute
        reservoirRefreshAmount: 300, // reset to 300 when the minute has passed
        reservoirRefreshInterval: 60 * 1000, // the 'per minute', must be divisible by 250
        maxConcurrent: 1,
        minTime: 100, // 30 per second => 1 req per 33 ms.
      },
    );
  }

  // When adding to the queue use this method, takes in a promise. Read the documentation of 'bottleneck' if you want to use async/await or callbacks instead.
  add(promise: Job) {
    return this.limiter.schedule(promise);
  }
}

export const RateLimiterQueue = new Queue();
