import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function handleDaemonError(
  message: string,
  setError: (e: string) => void
) {
  if (isDaemonUnimplemented(message)) {
    setError(
      'User management is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
}

export function extractErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}
