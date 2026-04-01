import type { SyncState } from './SyncState'
import { SyncPreview } from './SyncPreview'
import { SyncResults } from './SyncResults'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { GitContributor } from '@/gen/centy_pb'

interface SyncModalContentProps {
  state: SyncState
  error: string | null
  wouldCreate: GitContributor[]
  wouldSkip: GitContributor[]
  created: string[]
  skipped: string[]
  syncErrors: string[]
  fetchPreview: () => void
}

export function SyncModalContent({
  state,
  error,
  wouldCreate,
  wouldSkip,
  created,
  skipped,
  syncErrors,
  fetchPreview,
}: SyncModalContentProps) {
  return (
    <div className="sync-modal-content">
      {state === 'loading' && (
        <div className="sync-loading">
          <p className="sync-loading-text">Checking git history...</p>
        </div>
      )}
      {state === 'error' && (
        <div className="sync-error">
          <DaemonErrorMessage error={error || ''} />
          {error && !isDaemonUnimplemented(error) && (
            <button onClick={fetchPreview} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      )}
      {state === 'preview' && (
        <div className="sync-preview">
          <SyncPreview wouldCreate={wouldCreate} wouldSkip={wouldSkip} />
        </div>
      )}
      {state === 'syncing' && (
        <div className="sync-loading">
          <p className="sync-loading-text">Creating users...</p>
        </div>
      )}
      {state === 'success' && (
        <SyncResults
          created={created}
          skipped={skipped}
          syncErrors={syncErrors}
        />
      )}
    </div>
  )
}
