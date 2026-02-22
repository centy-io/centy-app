'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ArchivedProjectItemProps {
  project: ProjectInfo
  confirmRemove: string | null
  removingPath: string | null
  onRestore: (path: string) => void
  onRestoreAndSelect: (project: ProjectInfo) => void
  onRemove: (path: string) => Promise<void>
  onSetConfirmRemove: (v: string | null) => void
}

// eslint-disable-next-line max-lines-per-function
export function ArchivedProjectItem({
  project,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onSetConfirmRemove,
}: ArchivedProjectItemProps) {
  return (
    <li className="archived-item">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {project.userTitle || project.projectTitle || project.name}
        </span>
        <span className="archived-item-path">{project.displayPath}</span>
        <div className="archived-item-stats">
          <span className="archived-item-stat">Issues: {project.issueCount}</span>
          <span className="archived-item-stat">Docs: {project.docCount}</span>
          {!project.initialized && (
            <span className="not-initialized-badge">Not initialized</span>
          )}
        </div>
      </div>
      <div className="archived-item-actions">
        {confirmRemove === project.path ? (
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
              onClick={() => onSetConfirmRemove(null)}
              disabled={removingPath === project.path}
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              className="restore-btn"
              onClick={() => onRestore(project.path)}
            >
              Restore
            </button>
            <button
              className="restore-select-btn"
              onClick={() => onRestoreAndSelect(project)}
            >
              Restore & Select
            </button>
            <button
              className="remove-btn"
              onClick={() => onSetConfirmRemove(project.path)}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </li>
  )
}
