import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_CORS_DOCS_URL } = process.env

export const CORS_DOCS_URL =
  NEXT_PUBLIC_CORS_DOCS_URL ?? urlDefaults.CORS_DOCS_URL
