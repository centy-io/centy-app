/* eslint-disable max-lines */
'use client'

import { useCallback, useEffect } from 'react'
import { useSyncUsers } from './useSyncUsers'
import type { SyncState } from './SyncState'
import { SyncPreview } from './SyncPreview'
import { SyncResults } from './SyncResults'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { GitContributor } from '@/gen/centy_pb'

interface SyncUsersModalProps {
  onClose: () => void
  onSynced: (createdCount: number) => void
}

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

function SyncModalContent({
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

interface SyncModalActionsProps {
  state: SyncState
  wouldCreateCount: number
  handleClose: () => void
  handleSync: () => void
}

function SyncModalActions({
  state,
  wouldCreateCount,
  handleClose,
  handleSync,
}: SyncModalActionsProps) {
  return (
    <div className="sync-modal-actions">
      {state === 'preview' && wouldCreateCount > 0 && (
        <>
          <button onClick={handleClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSync} className="sync-confirm-btn">
            Create {wouldCreateCount} User{wouldCreateCount !== 1 ? 's' : ''}
          </button>
        </>
      )}
      {state === 'preview' && wouldCreateCount === 0 && (
        <button onClick={handleClose} className="done-btn">
          Done
        </button>
      )}
      {state === 'success' && (
        <button onClick={handleClose} className="done-btn">
          Done
        </button>
      )}
      {state === 'error' && (
        <button onClick={handleClose} className="cancel-btn">
          Close
        </button>
      )}
    </div>
  )
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
          <h3 className="sync-modal-title">Sync Users from Git</h3>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <SyncModalContent
          state={sync.state}
          error={sync.error}
          wouldCreate={sync.wouldCreate}
          wouldSkip={sync.wouldSkip}
          created={sync.created}
          skipped={sync.skipped}
          syncErrors={sync.syncErrors}
          fetchPreview={sync.fetchPreview}
        />
        <SyncModalActions
          state={sync.state}
          wouldCreateCount={sync.wouldCreate.length}
          handleClose={handleClose}
          handleSync={sync.handleSync}
        />
      </div>
    </div>
  )
}
