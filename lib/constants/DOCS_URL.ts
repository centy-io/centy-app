import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_DOCS_URL } = process.env

export const DOCS_URL = NEXT_PUBLIC_DOCS_URL || urlDefaults.DOCS_URL
