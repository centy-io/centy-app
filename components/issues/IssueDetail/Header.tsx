'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { EditorSelector } from '@/components/shared/EditorSelector'

interface HeaderProps {
  issuesListUrl: RouteLiteral
  isEditing: boolean
  saving: boolean
  openingInVscode: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onMove: () => void
  onDuplicate: () => void
  onDelete: () => void
  onOpenInVscode: () => Promise<void>
  onOpenInTerminal: () => Promise<void>
}

export function Header({
  issuesListUrl,
  isEditing,
  saving,
  openingInVscode,
  onEdit,
  onCancelEdit,
  onSave,
  onMove,
  onDuplicate,
  onDelete,
  onOpenInVscode,
  onOpenInTerminal,
}: HeaderProps): ReactElement {
  return (
    <div className="issue-header">
      <Link href={issuesListUrl} className="back-link">
        Back to Issues
      </Link>

      <div className="issue-actions">
        {!isEditing ? (
          <>
            <EditorSelector
              onOpenInVscode={onOpenInVscode}
              onOpenInTerminal={onOpenInTerminal}
              loading={openingInVscode}
            />
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
