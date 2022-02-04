export const CORS_WHITELIST = [
  'http://localhost:3000',

  // Raw domain
  'https://dsynths-app-v2.vercel.app',
  'http://dsynths-app-v2.vercel.app',

  // Client production with www
  'https://www.dsynths.com',
  'http://www.dsynths.com',

  // Client production without www
  'https://dsynths.com',
  'http://dsynths.com',

  // Client staging
  'https://staging.dsynths.com',
  'http://staging.dsynths.com',
]

export const CACHE_EXPIRE_STOCKS_SEC = 10 * 60
export const CACHE_EXPIRE_CRYPTO_SEC = 60
export const CACHE_EXPIRE_QUOTE_SEC = 60
