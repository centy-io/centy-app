'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useArchivedProjectsList } from './useArchivedProjectsList'
import { ArchivedProjectItem } from './ArchivedProjectItem'

export function ArchivedProjects() {
  const hook = useArchivedProjectsList()

  return (
    <div className="archived-projects">
      <div className="archived-header">
        <h2>Archived Projects</h2>
        <div className="archived-header-actions">
          {hook.hasArchivedProjects && !hook.loading && (
            <>
              {hook.confirmRemoveAll ? (
                <div className="remove-all-confirm">
                  <span className="confirm-text">Remove all permanently?</span>
                  <button
                    className="confirm-yes-btn"
                    onClick={hook.handleRemoveAll}
                    disabled={hook.removingAll}
                  >
                    {hook.removingAll ? 'Removing...' : 'Yes'}
                  </button>
                  <button
                    className="confirm-no-btn"
                    onClick={() => hook.setConfirmRemoveAll(false)}
                    disabled={hook.removingAll}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  className="remove-all-btn"
                  onClick={() => hook.setConfirmRemoveAll(true)}
                >
                  Remove all
                </button>
              )}
            </>
          )}
          <Link href="/" className="back-link">
            Back to Projects
          </Link>
        </div>
      </div>
      {hook.error && <DaemonErrorMessage error={hook.error} />}
      {hook.loading ? (
        <div className="loading">Loading projects...</div>
      ) : hook.archivedProjects.length === 0 &&
        hook.archivedPathsNotInDaemon.length === 0 ? (
        <div className="empty-state">
          <p>No archived projects</p>
          <p className="hint">
            Archive projects from the project selector to see them here
          </p>
        </div>
      ) : (
        <ul className="archived-list">
          {hook.archivedProjects.map(project => (
            <ArchivedProjectItem
              key={project.path}
              project={project}
              confirmRemove={hook.confirmRemove}
              removingPath={hook.removingPath}
              setConfirmRemove={hook.setConfirmRemove}
              handleRestore={hook.handleRestore}
              handleRestoreAndSelect={hook.handleRestoreAndSelect}
              handleRemove={hook.handleRemove}
            />
          ))}
          {hook.archivedPathsNotInDaemon.map(path => (
            <li key={path} className="archived-item stale">
              <div className="archived-item-info">
                <span className="archived-item-name">
                  {path.split('/').pop() || path}
                </span>
                <span className="archived-item-path">{path}</span>
                <div className="archived-item-stats">
                  <span className="stale-badge">Not tracked by daemon</span>
                </div>
              </div>
              <div className="archived-item-actions">
                {hook.confirmRemove === path ? (
                  <>
                    <span className="confirm-text">Remove permanently?</span>
                    <button
                      className="confirm-yes-btn"
                      onClick={() => hook.handleRemoveStale(path)}
                    >
                      Yes
                    </button>
                    <button
                      className="confirm-no-btn"
                      onClick={() => hook.setConfirmRemove(null)}
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    className="remove-btn"
                    onClick={() => hook.setConfirmRemove(path)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
