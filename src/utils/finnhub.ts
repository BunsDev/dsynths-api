import FinnhubAPI from '@stoqey/finnhub'
const { FINNHUB_API_KEY } = process.env
const Client = new FinnhubAPI(FINNHUB_API_KEY)
export default Client
