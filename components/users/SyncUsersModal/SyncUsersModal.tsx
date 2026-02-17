'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { SyncUsersModalProps } from './SyncUsersModal.types'
import { useSyncUsers } from './useSyncUsers'

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
              {hook.wouldCreate.length === 0 && hook.wouldSkip.length === 0 ? (
                <div className="sync-empty">
                  <p>No git contributors found in this repository.</p>
                </div>
              ) : hook.wouldCreate.length === 0 ? (
                <div className="sync-up-to-date">
                  <p>All git contributors are already in the users list.</p>
                </div>
              ) : (
                <>
                  <div className="sync-section">
                    <h4>Will Create ({hook.wouldCreate.length})</h4>
                    <ul className="contributor-list">
                      {hook.wouldCreate.map((c, i) => (
                        <li key={i} className="contributor-item create">
                          <span className="contributor-name">{c.name}</span>
                          <span className="contributor-email">{c.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {hook.wouldSkip.length > 0 && (
                    <div className="sync-section">
                      <h4>Will Skip ({hook.wouldSkip.length})</h4>
                      <ul className="contributor-list">
                        {hook.wouldSkip.map((c, i) => (
                          <li key={i} className="contributor-item skip">
                            <span className="contributor-name">{c.name}</span>
                            <span className="contributor-email">{c.email}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {hook.state === 'syncing' && (
            <div className="sync-loading">
              <p>Creating users...</p>
            </div>
          )}
          {hook.state === 'success' && (
            <div className="sync-results">
              <div className="sync-success-message">
                Sync completed successfully!
              </div>
              {hook.created.length > 0 && (
                <div className="sync-section">
                  <h4>Created ({hook.created.length})</h4>
                  <ul className="result-list">
                    {hook.created.map((id, i) => (
                      <li key={i} className="result-item created">
                        {id}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hook.skipped.length > 0 && (
                <div className="sync-section">
                  <h4>Skipped ({hook.skipped.length})</h4>
                  <ul className="result-list">
                    {hook.skipped.map((e, i) => (
                      <li key={i} className="result-item skipped">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hook.syncErrors.length > 0 && (
                <div className="sync-section">
                  <h4>Errors ({hook.syncErrors.length})</h4>
                  <ul className="result-list">
                    {hook.syncErrors.map((e, i) => (
                      <li key={i} className="result-item error">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="sync-modal-actions">
          {hook.state === 'preview' && hook.wouldCreate.length > 0 && (
            <>
              <button onClick={hook.handleClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={hook.handleSync} className="sync-confirm-btn">
                Create {hook.wouldCreate.length} User
                {hook.wouldCreate.length !== 1 ? 's' : ''}
              </button>
            </>
          )}
          {hook.state === 'preview' && hook.wouldCreate.length === 0 && (
            <button onClick={hook.handleClose} className="done-btn">
              Done
            </button>
          )}
          {hook.state === 'success' && (
            <button onClick={hook.handleClose} className="done-btn">
              Done
            </button>
          )}
          {hook.state === 'error' && (
            <button onClick={hook.handleClose} className="cancel-btn">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
