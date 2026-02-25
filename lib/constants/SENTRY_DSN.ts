const { NEXT_PUBLIC_SENTRY_DSN } = process.env

export const SENTRY_DSN =
  NEXT_PUBLIC_SENTRY_DSN ||
  'https://98aef6a0676becdbe5b6a8a8ee14b8d3@o4510682522976256.ingest.de.sentry.io/4510682527367248'
