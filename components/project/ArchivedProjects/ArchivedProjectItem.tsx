'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface ArchivedProjectItemProps {
  project: ProjectInfo
  confirmRemove: string | null
  removingPath: string | null
  setConfirmRemove: (v: string | null) => void
  handleRestore: (path: string) => void
  handleRestoreAndSelect: (project: ProjectInfo) => void
  handleRemove: (path: string) => void
}

export function ArchivedProjectItem(props: ArchivedProjectItemProps) {
  const { project, confirmRemove, removingPath } = props
  return (
    <li className="archived-item">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {project.userTitle || project.projectTitle || project.name}
        </span>
        <span className="archived-item-path">{project.displayPath}</span>
        <div className="archived-item-stats">
          <span>Issues: {project.issueCount}</span>
          <span>Docs: {project.docCount}</span>
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
              onClick={() => props.handleRemove(project.path)}
              disabled={removingPath === project.path}
            >
              {removingPath === project.path ? 'Removing...' : 'Yes'}
            </button>
            <button
              className="confirm-no-btn"
              onClick={() => props.setConfirmRemove(null)}
              disabled={removingPath === project.path}
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              className="restore-btn"
              onClick={() => props.handleRestore(project.path)}
            >
              Restore
            </button>
            <button
              className="restore-select-btn"
              onClick={() => props.handleRestoreAndSelect(project)}
            >
              Restore & Select
            </button>
            <button
              className="remove-btn"
              onClick={() => props.setConfirmRemove(project.path)}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </li>
  )
}
