'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useArchivedProjectActions } from './useArchivedProjectActions'
import { ArchivedProjectItem } from './ArchivedProjectItem'
import { ArchivedStaleItem } from './ArchivedStaleItem'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

type ArchivedState = ReturnType<typeof useArchivedProjectActions>

function RemoveAllControls({ state }: { state: ArchivedState }) {
  if (!state.hasArchivedProjects || state.loading) return null
  return state.confirmRemoveAll ? (
    <div className="remove-all-confirm">
      <span className="confirm-text">Remove all permanently?</span>
      <button
        className="confirm-yes-btn"
        onClick={state.handleRemoveAll}
        disabled={state.removingAll}
      >
        {state.removingAll ? 'Removing...' : 'Yes'}
      </button>
      <button
        className="confirm-no-btn"
        onClick={() => state.setConfirmRemoveAll(false)}
        disabled={state.removingAll}
      >
        No
      </button>
    </div>
  ) : (
    <button
      className="remove-all-btn"
      onClick={() => state.setConfirmRemoveAll(true)}
    >
      Remove all
    </button>
  )
}

function ArchivedProjectsList({ state }: { state: ArchivedState }) {
  if (state.loading) return <div className="loading">Loading projects...</div>
  if (
    state.archivedProjects.length === 0 &&
    state.archivedPathsNotInDaemon.length === 0
  ) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No archived projects</p>
        <p className="hint">
          Archive projects from the project selector to see them here
        </p>
      </div>
    )
  }
  return (
    <ul className="archived-list">
      {state.archivedProjects.map(project => (
        <ArchivedProjectItem
          key={project.path}
          project={project}
          confirmRemove={state.confirmRemove}
          removingPath={state.removingPath}
          onRestore={state.handleRestore}
          onRestoreAndSelect={state.handleRestoreAndSelect}
          onRemove={state.handleRemove}
          onSetConfirmRemove={state.setConfirmRemove}
        />
      ))}
      {state.archivedPathsNotInDaemon.map(path => (
        <ArchivedStaleItem
          key={path}
          path={path}
          confirmRemove={state.confirmRemove}
          onRemoveStale={state.handleRemoveStale}
          onSetConfirmRemove={state.setConfirmRemove}
        />
      ))}
    </ul>
  )
}

export function ArchivedProjects() {
  const state = useArchivedProjectActions()
  return (
    <div className="archived-projects">
      <div className="archived-header">
        <h2 className="archived-title">Archived Projects</h2>
        <div className="archived-header-actions">
          <RemoveAllControls state={state} />
          <Link href={route({ pathname: '/' })} className="back-link">
            Back to Projects
          </Link>
        </div>
      </div>
      {state.error && <DaemonErrorMessage error={state.error} />}
      <ArchivedProjectsList state={state} />
    </div>
  )
}
