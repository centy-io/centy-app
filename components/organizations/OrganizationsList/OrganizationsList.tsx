'use client'

import { useOrganizationsList } from './useOrganizationsList'
import { OrgListHeader } from './OrgListHeader'
import { OrgListBody } from './OrgListBody'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function OrganizationsList(): React.JSX.Element {
  const state = useOrganizationsList()
  const cascadeOrg = state.showCascadeConfirm
    ? state.organizations.find(o => o.slug === state.showCascadeConfirm)
    : undefined
  const cascadeProjectCount =
    cascadeOrg !== undefined ? cascadeOrg.projectCount : 0

  return (
    <div className="organizations-list">
      <OrgListHeader
        loading={state.loading}
        onRefresh={state.fetchOrganizations}
        sortPreset={state.sortPreset}
        onSortChange={state.setSortPreset}
      />
      {state.error && <DaemonErrorMessage error={state.error} />}
      {state.showDeleteConfirm && (
        <DeleteConfirm
          message="Are you sure you want to untrack this organization?"
          confirmLabel="Untrack"
          deleting={state.deleting}
          onCancel={() => {
            state.setShowDeleteConfirm(null)
            state.setDeleteError(null)
          }}
          onConfirm={() => state.handleDelete(state.showDeleteConfirm!)}
          error={state.deleteError}
        />
      )}
      {state.showCascadeConfirm && (
        <DeleteConfirm
          message={`This organization has ${cascadeProjectCount} project${cascadeProjectCount !== 1 ? 's' : ''}. Untracking it will also untrack all of its projects. Do you want to continue?`}
          confirmLabel="Untrack All"
          deleting={state.deleting}
          onCancel={() => {
            state.setShowCascadeConfirm(null)
            state.setDeleteError(null)
          }}
          onConfirm={() => state.handleDeleteCascade(state.showCascadeConfirm!)}
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
