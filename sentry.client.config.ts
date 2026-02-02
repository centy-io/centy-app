// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://98aef6a0676becdbe5b6a8a8ee14b8d3@o4510682522976256.ingest.de.sentry.io/4510682527367248',

  // Set environment for filtering in Sentry dashboard
  environment: process.env.NODE_ENV || 'development',

  // Adjust this value in production
  // Setting tracesSampleRate to 1.0 captures 100% of transactions for tracing
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  sendDefaultPii: true,

  // Enable automatic instrumentation for browser performance
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Capture 10% of sessions, 100% of sessions with errors
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Session Replay
  // Capture 10% of all sessions, plus 100% of sessions with errors
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
  replaysOnErrorSampleRate: 1.0,
})
