'use client'

import type { ReactElement } from 'react'
import type { useArchivedProjectActions } from './useArchivedProjectActions'
import { ArchivedProjectItem } from './ArchivedProjectItem'
import { ArchivedStaleItem } from './ArchivedStaleItem'

type State = ReturnType<typeof useArchivedProjectActions>

export function RemoveAllControl({ state }: { state: State }): ReactElement {
  if (state.confirmRemoveAll) {
    return (
      <div className="remove-all-confirm">
        <span className="confirm-text">Remove all permanently?</span>
        <button
          className="confirm-yes-btn"
          onClick={() => {
            void state.handleRemoveAll()
          }}
          disabled={state.removingAll}
        >
          {state.removingAll ? 'Removing...' : 'Yes'}
        </button>
        <button
          className="confirm-no-btn"
          onClick={() => {
            state.setConfirmRemoveAll(false)
          }}
          disabled={state.removingAll}
        >
          No
        </button>
      </div>
    )
  }
  return (
    <button
      className="remove-all-btn"
      onClick={() => {
        state.setConfirmRemoveAll(true)
      }}
    >
      Remove all
    </button>
  )
}

export function ArchivedList({ state }: { state: State }): ReactElement {
  if (state.loading) {
    return <div className="loading">Loading projects...</div>
  }
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
