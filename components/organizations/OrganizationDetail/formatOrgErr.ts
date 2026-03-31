import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function formatOrgErr(err: unknown): string {
  const m = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(m)
    ? 'Organizations feature is not available. Please update your daemon.'
    : m
}
