'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { SyncUsersRequestSchema, type GitContributor } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface SyncUsersModalProps {
  onClose: () => void
  onSynced: (createdCount: number) => void
}

type SyncState = 'loading' | 'preview' | 'syncing' | 'success' | 'error'

function handleSyncDaemonError(
  message: string,
  setError: (error: string) => void,
  setState: (state: SyncState) => void
) {
  if (isDaemonUnimplemented(message)) {
    setError(
      'User sync is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
  setState('error')
}

interface SyncPreviewContentProps {
  wouldCreate: GitContributor[]
  wouldSkip: GitContributor[]
}

function SyncPreviewContent({
  wouldCreate,
  wouldSkip,
}: SyncPreviewContentProps) {
  if (wouldCreate.length === 0 && wouldSkip.length === 0) {
    return (
      <div className="sync-empty">
        <p>No git contributors found in this repository.</p>
      </div>
    )
  }

  if (wouldCreate.length === 0) {
    return (
      <div className="sync-up-to-date">
        <p>All git contributors are already in the users list.</p>
      </div>
    )
  }

  return (
    <>
      <div className="sync-section">
        <h4>Will Create ({wouldCreate.length})</h4>
        <ul className="contributor-list">
          {wouldCreate.map((contributor, i) => (
            <li key={i} className="contributor-item create">
              <span className="contributor-name">{contributor.name}</span>
              <span className="contributor-email">{contributor.email}</span>
            </li>
          ))}
        </ul>
      </div>

      {wouldSkip.length > 0 && (
        <div className="sync-section">
          <h4>Will Skip ({wouldSkip.length})</h4>
          <ul className="contributor-list">
            {wouldSkip.map((contributor, i) => (
              <li key={i} className="contributor-item skip">
                <span className="contributor-name">{contributor.name}</span>
                <span className="contributor-email">{contributor.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

interface SyncResultsContentProps {
  created: string[]
  skipped: string[]
  syncErrors: string[]
}

function SyncResultsContent({
  created,
  skipped,
  syncErrors,
}: SyncResultsContentProps) {
  return (
    <div className="sync-results">
      <div className="sync-success-message">Sync completed successfully!</div>

      {created.length > 0 && (
        <div className="sync-section">
          <h4>Created ({created.length})</h4>
          <ul className="result-list">
            {created.map((userId, i) => (
              <li key={i} className="result-item created">
                {userId}
              </li>
            ))}
          </ul>
        </div>
      )}

      {skipped.length > 0 && (
        <div className="sync-section">
          <h4>Skipped ({skipped.length})</h4>
          <ul className="result-list">
            {skipped.map((email, i) => (
              <li key={i} className="result-item skipped">
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}

      {syncErrors.length > 0 && (
        <div className="sync-section">
          <h4>Errors ({syncErrors.length})</h4>
          <ul className="result-list">
            {syncErrors.map((err, i) => (
              <li key={i} className="result-item error">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface SyncModalActionsProps {
  state: SyncState
  wouldCreateCount: number
  onClose: () => void
  onSync: () => void
}

function SyncModalActions({
  state,
  wouldCreateCount,
  onClose,
  onSync,
}: SyncModalActionsProps) {
  return (
    <div className="sync-modal-actions">
      {state === 'preview' && wouldCreateCount > 0 && (
        <>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onSync} className="sync-confirm-btn">
            Create {wouldCreateCount} User
            {wouldCreateCount !== 1 ? 's' : ''}
          </button>
        </>
      )}

      {state === 'preview' && wouldCreateCount === 0 && (
        <button onClick={onClose} className="done-btn">
          Done
        </button>
      )}

      {state === 'success' && (
        <button onClick={onClose} className="done-btn">
          Done
        </button>
      )}

      {state === 'error' && (
        <button onClick={onClose} className="cancel-btn">
          Close
        </button>
      )}
    </div>
  )
}

function useSyncPreview(projectPath: string) {
  const [state, setState] = useState<SyncState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [wouldCreate, setWouldCreate] = useState<GitContributor[]>([])
  const [wouldSkip, setWouldSkip] = useState<GitContributor[]>([])

  const fetchPreview = useCallback(async () => {
    if (!projectPath) return
    setState('loading')
    setError(null)
    try {
      const request = create(SyncUsersRequestSchema, {
        projectPath,
        dryRun: true,
      })
      const response = await centyClient.syncUsers(request)
      if (response.success) {
        setWouldCreate(response.wouldCreate)
        setWouldSkip(response.wouldSkip)
        setState('preview')
      } else {
        handleSyncDaemonError(
          response.error || 'Failed to fetch git contributors',
          setError,
          setState
        )
      }
    } catch (err) {
      handleSyncDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError,
        setState
      )
    }
  }, [projectPath])

  useEffect(() => {
    void fetchPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    state,
    setState,
    error,
    setError,
    wouldCreate,
    wouldSkip,
    fetchPreview,
  }
}

function useSyncExecution(
  projectPath: string,
  setState: (s: SyncState) => void,
  setError: (e: string | null) => void
) {
  const [created, setCreated] = useState<string[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [syncErrors, setSyncErrors] = useState<string[]>([])

  const handleSync = useCallback(async () => {
    if (!projectPath) return
    setState('syncing')
    setError(null)
    try {
      const request = create(SyncUsersRequestSchema, {
        projectPath,
        dryRun: false,
      })
      const response = await centyClient.syncUsers(request)
      if (response.success) {
        setCreated(response.created)
        setSkipped(response.skipped)
        setSyncErrors(response.errors)
        setState('success')
      } else {
        handleSyncDaemonError(
          response.error || 'Failed to sync users',
          setError,
          setState
        )
      }
    } catch (err) {
      handleSyncDaemonError(
        err instanceof Error ? err.message : 'Failed to connect to daemon',
        setError,
        setState
      )
    }
  }, [projectPath, setState, setError])

  return { created, skipped, syncErrors, handleSync }
}

interface SyncModalContentProps {
  state: SyncState
  error: string | null
  fetchPreview: () => void
  wouldCreate: GitContributor[]
  wouldSkip: GitContributor[]
  created: string[]
  skipped: string[]
  syncErrors: string[]
}

function SyncModalContent({
  state,
  error,
  fetchPreview,
  wouldCreate,
  wouldSkip,
  created,
  skipped,
  syncErrors,
}: SyncModalContentProps) {
  return (
    <div className="sync-modal-content">
      {state === 'loading' && (
        <div className="sync-loading">
          <p>Checking git history...</p>
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
          <SyncPreviewContent wouldCreate={wouldCreate} wouldSkip={wouldSkip} />
        </div>
      )}
      {state === 'syncing' && (
        <div className="sync-loading">
          <p>Creating users...</p>
        </div>
      )}
      {state === 'success' && (
        <SyncResultsContent
          created={created}
          skipped={skipped}
          syncErrors={syncErrors}
        />
      )}
    </div>
  )
}

export function SyncUsersModal({ onClose, onSynced }: SyncUsersModalProps) {
  const { projectPath } = useProject()
  const {
    state,
    setState,
    error,
    setError,
    wouldCreate,
    wouldSkip,
    fetchPreview,
  } = useSyncPreview(projectPath)
  const { created, skipped, syncErrors, handleSync } = useSyncExecution(
    projectPath,
    setState,
    setError
  )

  const handleClose = useCallback(() => {
    if (state === 'success') {
      onSynced(created.length)
    } else {
      onClose()
    }
  }, [state, created.length, onSynced, onClose])

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
        <SyncModalContent
          state={state}
          error={error}
          fetchPreview={fetchPreview}
          wouldCreate={wouldCreate}
          wouldSkip={wouldSkip}
          created={created}
          skipped={skipped}
          syncErrors={syncErrors}
        />
        <SyncModalActions
          state={state}
          wouldCreateCount={wouldCreate.length}
          onClose={handleClose}
          onSync={handleSync}
        />
      </div>
    </div>
  )
}
