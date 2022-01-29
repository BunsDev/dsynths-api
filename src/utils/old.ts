// export type CoinGeckoData = Array<[number, number, number, number, number]>

// const getCoinGeckoData = async (symbol: string, from: number, to: number) => {
//   // const getDaysFromRange = (from: number, to: number) => {
//   //   const diff = Math.floor((to - from) / (60 * 60 * 24))
//   //   if (diff < 1) return 1
//   //   if (diff > 365) return 365
//   //   return diff
//   // }
//   // const getIDFromSymbol = async (symbol: string) => {
//   //   const response = await fetch('https://api.coingecko.com/api/v3/coins/list')
//   //   const coinsList = await response.json()
//   //   const symbolToSearch = symbol.toLowerCase()
//   //   const { id } = (coinsList as Array<{ symbol: string; id: string; name: string }>).find(
//   //     (coin: { symbol: string }) => coin.symbol === symbolToSearch
//   //   )
//   //   return id
//   // }
//   // const id = await getIDFromSymbol(symbol)
//   // console.info(`Fetching data for ${symbol}-${id} from ${from} to ${to} (${getDaysFromRange(from, to)})`)
//   // const candlesData = await fetch(
//   //   `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${getDaysFromRange(from, to)}`
//   // )
//   // const candlesJson = await candlesData.json()
//   // return candlesJson as CoinGeckoData
// }

// const reduceCoinGeckoDataResponse = (data: CoinGeckoData) => {
//   try {
//     return data.reduce((acc: StockCandle[], dataChunk: Array<number>) => {
//       const [time, open, high, low, close] = dataChunk
//       const obj: StockCandle = {
//         time,
//         open,
//         high,
//         low,
//         close,
//       }
//       acc.push(obj)
//       return acc
//     }, [])
//   } catch (err) {
//     console.info('Error reducing data response: ')
//     console.error(err)
//     return []
//   }
// }

// const getCryptoPrices = async (symbol: string, from: number, to: number): Promise<StockCandle[]> => {
//   const data: CoinGeckoData = await new Promise((resolve, reject) => {
//     RateLimiterQueue.add(() =>
//       getCoinGeckoData(symbol, from, to)
//         .then((data) => resolve(data))
//         .catch((err) => reject(err))
//     )
//   })
//   if (!data.length) {
//     console.info(
//       '[data] has returned 0 values for the requested range, this is either a bug or the requested dataset is out of range:'
//     )
//     console.info(data)
//     return []
//   }
//   return reduceCoinGeckoDataResponse(data)
// }
