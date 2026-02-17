import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { SyncState } from './SyncUsersModal.types'

export function handleSyncError(
  err: unknown,
  setError: (e: string) => void,
  setState: (s: SyncState) => void
) {
  const message =
    err instanceof Error ? err.message : 'Failed to connect to daemon'
  if (isDaemonUnimplemented(message)) {
    setError(
      'User sync is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
  setState('error')
}

export function handleResponseError(
  errorMsg: string,
  setError: (e: string) => void,
  setState: (s: SyncState) => void
) {
  if (isDaemonUnimplemented(errorMsg)) {
    setError(
      'User sync is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(errorMsg)
  }
  setState('error')
}
