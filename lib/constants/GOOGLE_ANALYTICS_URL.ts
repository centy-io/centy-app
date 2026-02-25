const { NEXT_PUBLIC_GOOGLE_ANALYTICS_URL } = process.env

export const GOOGLE_ANALYTICS_URL =
  NEXT_PUBLIC_GOOGLE_ANALYTICS_URL ||
  'https://www.googletagmanager.com/gtag/js?id=G-ZV5SD70Z2D'
