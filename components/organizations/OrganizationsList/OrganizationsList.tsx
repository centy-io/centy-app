'use client'

import { useOrganizationsList } from './useOrganizationsList'
import { UntrackConfirm } from './UntrackConfirm'
import { CascadeConfirm } from './CascadeConfirm'
import { OrgListHeader } from './OrgListHeader'
import { OrgListBody } from './OrgListBody'
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
      {state.showDeleteConfirm && <UntrackConfirm state={state} />}
      {state.showCascadeConfirm && (
        <CascadeConfirm state={state} projectCount={cascadeProjectCount} />
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
