import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function formatListErr(err: unknown): string {
  const message =
    err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(message)
    ? 'Organizations feature is not available. Please update your daemon.'
    : message
}
