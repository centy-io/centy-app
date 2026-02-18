// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  init,
  replayIntegration,
  captureRouterTransitionStart,
} from '@sentry/nextjs'
import { SENTRY_DSN } from '@/lib/constants/urls'

const { NODE_ENV } = process.env

init({
  dsn: SENTRY_DSN,

  // Set environment for filtering in Sentry dashboard
  environment: NODE_ENV || 'development',

  // Add optional integrations for additional features
  integrations: [replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: NODE_ENV === 'production' ? 0.2 : 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
})

export const onRouterTransitionStart = captureRouterTransitionStart
