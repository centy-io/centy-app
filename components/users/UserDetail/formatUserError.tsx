'use client'

import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function formatUserError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}
