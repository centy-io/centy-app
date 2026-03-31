'use client'

import type { ReactElement } from 'react'
import { ArchivedProjectItemActions } from './ArchivedProjectItemActions'
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

export function ArchivedProjectItem({
  project,
  confirmRemove,
  removingPath,
  onRestore,
  onRestoreAndSelect,
  onRemove,
  onSetConfirmRemove,
}: ArchivedProjectItemProps): ReactElement {
  return (
    <li className="archived-item">
      <div className="archived-item-info">
        <span className="archived-item-name">
          {project.userTitle || project.projectTitle || project.name}
        </span>
        <span className="archived-item-path">{project.displayPath}</span>
        <div className="archived-item-stats">
          <span className="archived-item-stat">
            Issues: {project.issueCount}
          </span>
          <span className="archived-item-stat">Docs: {project.docCount}</span>
          {!project.initialized && (
            <span className="not-initialized-badge">Not initialized</span>
          )}
        </div>
      </div>
      <div className="archived-item-actions">
        <ArchivedProjectItemActions
          project={project}
          confirmRemove={confirmRemove}
          removingPath={removingPath}
          onRestore={onRestore}
          onRestoreAndSelect={onRestoreAndSelect}
          onRemove={onRemove}
          onSetConfirmRemove={onSetConfirmRemove}
        />
      </div>
    </li>
  )
}
