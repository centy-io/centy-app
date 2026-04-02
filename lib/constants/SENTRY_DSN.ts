import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_SENTRY_DSN } = process.env

export const SENTRY_DSN = NEXT_PUBLIC_SENTRY_DSN || urlDefaults.SENTRY_DSN
