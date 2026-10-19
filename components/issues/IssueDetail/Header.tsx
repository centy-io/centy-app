'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface HeaderProps {
  issuesListUrl: RouteLiteral
  isEditing: boolean
  saving: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onMove: () => void
  onDuplicate: () => void
  onDelete: () => void
  onOpenInWorktree: () => void
}

export function Header({
  issuesListUrl,
  isEditing,
  saving,
  onEdit,
  onCancelEdit,
  onSave,
  onMove,
  onDuplicate,
  onDelete,
  onOpenInWorktree,
}: HeaderProps): ReactElement {
  return (
    <div className="issue-header">
      <Link href={issuesListUrl} className="back-link">
        Back to Issues
      </Link>

      <div className="issue-actions">
        {!isEditing ? (
          <>
            <button
              onClick={onOpenInWorktree}
              className="editor-primary-btn vscode"
            >
              Open in Worktree
            </button>
            <button onClick={onEdit} className="edit-btn">
              Edit
            </button>
            <button onClick={onMove} className="move-btn">
              Move
            </button>
            <button onClick={onDuplicate} className="duplicate-btn">
              Duplicate
            </button>
            <button onClick={onDelete} className="delete-btn">
              Delete
            </button>
          </>
        ) : (
          <>
            <button onClick={onCancelEdit} className="cancel-btn">
              Cancel
            </button>
            <button onClick={onSave} disabled={saving} className="save-btn">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
