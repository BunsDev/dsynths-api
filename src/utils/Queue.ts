import Bottleneck from 'bottleneck'

type Job = () => Promise<any>
type LimiterConfig = {
  reservoir?: number
  reservoirRefreshAmount?: number
  reservoirRefreshInterval?: number
  maxConcurrent?: number
  minTime?: number
}

// Finnhub API rate limits at 300 calls/minute && 30 calls/sec
class Queue {
  private limiter: Bottleneck

  constructor(config?: LimiterConfig) {
    this.limiter = new Bottleneck(
      config || {
        reservoir: 300, // 300 per minute
        reservoirRefreshAmount: 300, // reset to 300 when the minute has passed
        reservoirRefreshInterval: 60 * 1000, // the 'per minute', must be divisible by 250
        maxConcurrent: 1,
        minTime: 50, // 30 per second => 1 req per 33 ms. (using 50 for safety)
      }
    )
  }

  // When adding to the queue use this method, takes in a promise. Read the documentation of 'bottleneck' if you want to use async/await or callbacks instead.
  add(promise: Job) {
    return this.limiter.schedule(promise)
  }
}

export default new Queue()
