'use client'

import { useCallback, useEffect } from 'react'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { useSyncUsers } from './useSyncUsers'
import { SyncPreview } from './SyncPreview'
import { SyncResults } from './SyncResults'

interface SyncUsersModalProps {
  onClose: () => void
  onSynced: (createdCount: number) => void
}

export function SyncUsersModal({ onClose, onSynced }: SyncUsersModalProps) {
  const sync = useSyncUsers()

  const handleClose = useCallback(() => {
    if (sync.state === 'success') {
      onSynced(sync.created.length)
    } else {
      onClose()
    }
  }, [sync.state, sync.created.length, onSynced, onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  return (
    <div className="sync-modal-overlay" onClick={handleClose}>
      <div className="sync-modal" onClick={e => e.stopPropagation()}>
        <div className="sync-modal-header">
          <h3>Sync Users from Git</h3>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="sync-modal-content">
          {sync.state === 'loading' && (
            <div className="sync-loading">
              <p>Checking git history...</p>
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
              <p>Creating users...</p>
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
        <div className="sync-modal-actions">
          {sync.state === 'preview' && sync.wouldCreate.length > 0 && (
            <>
              <button onClick={handleClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={sync.handleSync} className="sync-confirm-btn">
                Create {sync.wouldCreate.length} User
                {sync.wouldCreate.length !== 1 ? 's' : ''}
              </button>
            </>
          )}
          {sync.state === 'preview' && sync.wouldCreate.length === 0 && (
            <button onClick={handleClose} className="done-btn">
              Done
            </button>
          )}
          {sync.state === 'success' && (
            <button onClick={handleClose} className="done-btn">
              Done
            </button>
          )}
          {sync.state === 'error' && (
            <button onClick={handleClose} className="cancel-btn">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
