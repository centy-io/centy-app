import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface GenericItemDetailHeaderProps {
  displayName: string
  listUrl: RouteLiteral
  isEditing: boolean
  saving: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onDeleteRequest: () => void
}

export function GenericItemDetailHeader({
  displayName,
  listUrl,
  isEditing,
  saving,
  onEdit,
  onCancelEdit,
  onSave,
  onDeleteRequest,
}: GenericItemDetailHeaderProps) {
  return (
    <div className="doc-header">
      <Link href={listUrl} className="back-link">
        Back to {displayName}s
      </Link>
      <div className="header-actions">
        {isEditing ? (
          <>
            <button onClick={onCancelEdit} className="secondary">
              Cancel
            </button>
            <button onClick={onSave} disabled={saving} className="primary">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <>
            <button onClick={onEdit} className="secondary">
              Edit
            </button>
            <button onClick={onDeleteRequest} className="delete-btn">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
