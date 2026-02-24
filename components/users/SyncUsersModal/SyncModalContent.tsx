'use client'

import type { useSyncUsers } from './useSyncUsers'
import { SyncPreview } from './SyncPreview'
import { SyncResults } from './SyncResults'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function SyncModalContent({
  sync,
}: {
  sync: ReturnType<typeof useSyncUsers>
}) {
  return (
    <div className="sync-modal-content">
      {sync.state === 'loading' && (
        <div className="sync-loading">
          <p className="sync-loading-text">Checking git history...</p>
        </div>
      )}
      {sync.state === 'error' && (
        <div className="sync-error">
          <DaemonErrorMessage error={sync.error || ''} />
          {sync.error && !isDaemonUnimplemented(sync.error) && (
            <button onClick={sync.fetchPreview} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      )}
      {sync.state === 'preview' && (
        <div className="sync-preview">
          <SyncPreview
            wouldCreate={sync.wouldCreate}
            wouldSkip={sync.wouldSkip}
          />
        </div>
      )}
      {sync.state === 'syncing' && (
        <div className="sync-loading">
          <p className="sync-loading-text">Creating users...</p>
        </div>
      )}
      {sync.state === 'success' && (
        <SyncResults
          created={sync.created}
          skipped={sync.skipped}
          syncErrors={sync.syncErrors}
        />
      )}
    </div>
  )
}
