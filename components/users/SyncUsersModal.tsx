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

export function SyncUsersModal({ onClose, onSynced }: SyncUsersModalProps) {
  const { projectPath } = useProject()

  const [state, setState] = useState<SyncState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [wouldCreate, setWouldCreate] = useState<GitContributor[]>([])
  const [wouldSkip, setWouldSkip] = useState<GitContributor[]>([])
  const [created, setCreated] = useState<string[]>([])
  const [skipped, setSkipped] = useState<string[]>([])
  const [syncErrors, setSyncErrors] = useState<string[]>([])

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
        const errorMsg = response.error || 'Failed to fetch git contributors'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'User sync is not yet available. Please update your daemon to the latest version.'
          )
        } else {
          setError(errorMsg)
        }
        setState('error')
      }
    } catch (err) {
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
  }, [projectPath])

  // Fetch preview on mount
  useEffect(() => {
    void fetchPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        const errorMsg = response.error || 'Failed to sync users'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'User sync is not yet available. Please update your daemon to the latest version.'
          )
        } else {
          setError(errorMsg)
        }
        setState('error')
      }
    } catch (err) {
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
  }, [projectPath])

  const handleClose = useCallback(() => {
    if (state === 'success') {
      onSynced(created.length)
    } else {
      onClose()
    }
  }, [state, created.length, onSynced, onClose])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
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
              {wouldCreate.length === 0 && wouldSkip.length === 0 ? (
                <div className="sync-empty">
                  <p className="sync-empty-text">
                    No git contributors found in this repository.
                  </p>
                </div>
              ) : wouldCreate.length === 0 ? (
                <div className="sync-up-to-date">
                  <p className="sync-up-to-date-text">
                    All git contributors are already in the users list.
                  </p>
                </div>
              ) : (
                <>
                  <div className="sync-section">
                    <h4 className="sync-section-title">
                      Will Create ({wouldCreate.length})
                    </h4>
                    <ul className="contributor-list">
                      {wouldCreate.map((contributor, i) => (
                        <li key={i} className="contributor-item create">
                          <span className="contributor-name">
                            {contributor.name}
                          </span>
                          <span className="contributor-email">
                            {contributor.email}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {wouldSkip.length > 0 && (
                    <div className="sync-section">
                      <h4 className="sync-section-title">
                        Will Skip ({wouldSkip.length})
                      </h4>
                      <ul className="contributor-list">
                        {wouldSkip.map((contributor, i) => (
                          <li key={i} className="contributor-item skip">
                            <span className="contributor-name">
                              {contributor.name}
                            </span>
                            <span className="contributor-email">
                              {contributor.email}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {state === 'syncing' && (
            <div className="sync-loading">
              <p className="sync-loading-text">Creating users...</p>
            </div>
          )}

          {state === 'success' && (
            <div className="sync-results">
              <div className="sync-success-message">
                Sync completed successfully!
              </div>

              {created.length > 0 && (
                <div className="sync-section">
                  <h4 className="sync-section-title">
                    Created ({created.length})
                  </h4>
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
                  <h4 className="sync-section-title">
                    Skipped ({skipped.length})
                  </h4>
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
                  <h4 className="sync-section-title">
                    Errors ({syncErrors.length})
                  </h4>
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
          )}
        </div>

        <div className="sync-modal-actions">
          {state === 'preview' && wouldCreate.length > 0 && (
            <>
              <button onClick={handleClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSync} className="sync-confirm-btn">
                Create {wouldCreate.length} User
                {wouldCreate.length !== 1 ? 's' : ''}
              </button>
            </>
          )}

          {state === 'preview' && wouldCreate.length === 0 && (
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
      </div>
    </div>
  )
}
