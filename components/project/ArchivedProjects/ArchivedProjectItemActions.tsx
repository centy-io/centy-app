'use client'

import type { ReactElement } from 'react'
import type { ProjectInfo } from '@/gen/centy_pb'

export interface ArchivedProjectItemActionsProps {
  project: ProjectInfo
  confirmRemove: string | null
  removingPath: string | null
  onRestore: (path: string) => void
  onRestoreAndSelect: (project: ProjectInfo) => void
  onRemove: (path: string) => Promise<void>
  onSetConfirmRemove: (v: string | null) => void
}

export function ArchivedProjectItemActions({
  project,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onSetConfirmRemove,
}: ArchivedProjectItemActionsProps): ReactElement {
  if (confirmRemove === project.path) {
    return (
      <>
        <span className="confirm-text">Remove permanently?</span>
        <button
          className="confirm-yes-btn"
          onClick={() => onRemove(project.path)}
          disabled={removingPath === project.path}
        >
          {removingPath === project.path ? 'Removing...' : 'Yes'}
        </button>
        <button
          className="confirm-no-btn"
          onClick={() => {
            onSetConfirmRemove(null)
          }}
          disabled={removingPath === project.path}
        >
          No
        </button>
      </>
    )
  }
  return (
    <>
      <button
        className="restore-btn"
        onClick={() => {
          onRestore(project.path)
        }}
      >
        Restore
      </button>
      <button
        className="restore-select-btn"
        onClick={() => {
          onRestoreAndSelect(project)
        }}
      >
        Restore & Select
      </button>
      <button
        className="remove-btn"
        onClick={() => {
          onSetConfirmRemove(project.path)
        }}
      >
        Remove
      </button>
    </>
  )
}
