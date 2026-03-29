'use client'

import type { ProjectInfo } from '@/gen/centy_pb'

interface DeleteConfirmProps {
  projects: ProjectInfo[]
  deleting: boolean
  deleteError: string | null
  handleDelete: () => Promise<void>
  setShowDeleteConfirm: (v: boolean) => void
  setDeleteError: (v: string | null) => void
}

export function OrgDeleteConfirm(props: DeleteConfirmProps): React.JSX.Element {
  const {
    projects,
    deleting,
    deleteError,
    handleDelete,
    setShowDeleteConfirm,
    setDeleteError,
  } = props
  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">
        Are you sure you want to delete this organization?
      </p>
      {projects.length > 0 && (
        <p className="delete-warning">
          This organization has {projects.length} project(s). They will become
          ungrouped.
        </p>
      )}
      {deleteError && <p className="delete-error-message">{deleteError}</p>}
      <div className="delete-confirm-actions">
        <button
          onClick={() => {
            setShowDeleteConfirm(false)
            setDeleteError(null)
          }}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}
