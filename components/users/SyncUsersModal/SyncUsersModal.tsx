'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { SyncUsersModalProps } from './SyncUsersModal.types'
import { useSyncUsers } from './useSyncUsers'
import { SyncPreview } from './SyncPreview'
import { SyncResults } from './SyncResults'
import { SyncModalActions } from './SyncModalActions'

export function SyncUsersModal(props: SyncUsersModalProps) {
  const hook = useSyncUsers(props)

  return (
    <div className="sync-modal-overlay" onClick={hook.handleClose}>
      <div className="sync-modal" onClick={e => e.stopPropagation()}>
        <div className="sync-modal-header">
          <h3>Sync Users from Git</h3>
          <button className="close-btn" onClick={hook.handleClose}>
            &times;
          </button>
        </div>
        <div className="sync-modal-content">
          {hook.state === 'loading' && (
            <div className="sync-loading">
              <p>Checking git history...</p>
            </div>
          )}
          {hook.state === 'error' && (
            <div className="sync-error">
              <DaemonErrorMessage error={hook.error || ''} />
              {hook.error && !isDaemonUnimplemented(hook.error) && (
                <button onClick={hook.fetchPreview} className="retry-btn">
                  Retry
                </button>
              )}
            </div>
          )}
          {hook.state === 'preview' && (
            <div className="sync-preview">
              <SyncPreview
                wouldCreate={hook.wouldCreate}
                wouldSkip={hook.wouldSkip}
              />
            </div>
          )}
          {hook.state === 'syncing' && (
            <div className="sync-loading">
              <p>Creating users...</p>
            </div>
          )}
          {hook.state === 'success' && (
            <SyncResults
              created={hook.created}
              skipped={hook.skipped}
              syncErrors={hook.syncErrors}
            />
          )}
        </div>
        <SyncModalActions
          state={hook.state}
          wouldCreateCount={hook.wouldCreate.length}
          handleClose={hook.handleClose}
          handleSync={hook.handleSync}
        />
      </div>
    </div>
  )
}
