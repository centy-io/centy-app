import { execSync } from 'node:child_process'
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'
import withRoutes from 'nextjs-routes/config'
import { MissingEnvVarsError } from './lib/MissingEnvVarsError'

function getCommitSha(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return ''
  }
}

/**
 * Canonical list of required environment variables.
 * The build will fail with a descriptive error if any of these are missing.
 * Copy .env.example to .env.local for local development.
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_DAEMON_URL',
  'NEXT_PUBLIC_DOCS_URL',
  'NEXT_PUBLIC_DAEMON_INSTALL_URL',
  'NEXT_PUBLIC_CORS_DOCS_URL',
  'NEXT_PUBLIC_GOOGLE_ANALYTICS_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
]

const definedEnvVarKeys = new Set(
  Object.entries(process.env)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
)

const missingEnvVars = REQUIRED_ENV_VARS.filter(
  key => !definedEnvVarKeys.has(key)
)

if (missingEnvVars.length > 0) {
  throw new MissingEnvVarsError(missingEnvVars)
}

const {
  NODE_ENV,
  COMMIT_SHA,
  CI,
  NEXT_PUBLIC_DAEMON_URL,
  NEXT_PUBLIC_DOCS_URL,
  NEXT_PUBLIC_DAEMON_INSTALL_URL,
  NEXT_PUBLIC_CORS_DOCS_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_URL,
  NEXT_PUBLIC_SENTRY_DSN,
} = process.env

const nextConfig: NextConfig = {
  output: NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: COMMIT_SHA ?? getCommitSha(),
    NEXT_PUBLIC_DAEMON_URL: NEXT_PUBLIC_DAEMON_URL ?? 'http://localhost:50051',
    NEXT_PUBLIC_DOCS_URL: NEXT_PUBLIC_DOCS_URL ?? 'https://docs.centy.io',
    NEXT_PUBLIC_DAEMON_INSTALL_URL:
      NEXT_PUBLIC_DAEMON_INSTALL_URL ??
      'https://github.com/centy-io/installer/releases/latest/download/install.sh',
    NEXT_PUBLIC_CORS_DOCS_URL:
      NEXT_PUBLIC_CORS_DOCS_URL ?? 'https://app.centy.io',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_URL:
      NEXT_PUBLIC_GOOGLE_ANALYTICS_URL ??
      'https://www.googletagmanager.com/gtag/js?id=G-ZV5SD70Z2D',
    NEXT_PUBLIC_SENTRY_DSN:
      NEXT_PUBLIC_SENTRY_DSN ??
      'https://98aef6a0676becdbe5b6a8a8ee14b8d3@o4510682522976256.ingest.de.sentry.io/4510682527367248',
  },
}

export default withSentryConfig(withRoutes()(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'centy',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
})
