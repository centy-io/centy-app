'use client'

import { useOrganizationsList } from './useOrganizationsList'
import { OrgListHeader } from './OrgListHeader'
import { OrgListBody } from './OrgListBody'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function OrganizationsList(): React.JSX.Element {
  const state = useOrganizationsList()
  const deleteConfirmSlug = state.showDeleteConfirm
  const cascadeConfirmSlug = state.showCascadeConfirm
  const cascadeOrg = cascadeConfirmSlug
    ? state.organizations.find(o => o.slug === cascadeConfirmSlug)
    : undefined
  const cascadeProjectCount =
    cascadeOrg !== undefined ? cascadeOrg.projectCount : 0

  return (
    <div className="organizations-list">
      <OrgListHeader
        loading={state.loading}
        onRefresh={() => void state.fetchOrganizations()}
        sortPreset={state.sortPreset}
        onSortChange={state.setSortPreset}
      />
      {state.error && <DaemonErrorMessage error={state.error} />}
      {deleteConfirmSlug && (
        <DeleteConfirm
          message="Are you sure you want to untrack this organization?"
          confirmLabel="Untrack"
          deleting={state.deleting}
          onCancel={() => {
            state.setShowDeleteConfirm(null)
            state.setDeleteError(null)
          }}
          onConfirm={() => void state.handleDelete(deleteConfirmSlug)}
          error={state.deleteError}
        />
      )}
      {cascadeConfirmSlug && (
        <DeleteConfirm
          message={`This organization has ${cascadeProjectCount} project${cascadeProjectCount !== 1 ? 's' : ''}. Untracking it will also untrack all of its projects. Do you want to continue?`}
          confirmLabel="Untrack All"
          deleting={state.deleting}
          onCancel={() => {
            state.setShowCascadeConfirm(null)
            state.setDeleteError(null)
          }}
          onConfirm={() => void state.handleDeleteCascade(cascadeConfirmSlug)}
          error={state.deleteError}
        />
      )}
      <OrgListBody state={state} />
      {state.contextMenu && (
        <ContextMenu
          items={state.contextMenuItems}
          x={state.contextMenu.x}
          y={state.contextMenu.y}
          onClose={() => state.setContextMenu(null)}
        />
      )}
    </div>
  )
}
