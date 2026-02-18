'use client'

import Link from 'next/link'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useOrganizationsList } from './useOrganizationsList'
import { OrganizationsTable } from './OrganizationsTable'

export function OrganizationsList() {
  const state = useOrganizationsList()

  return (
    <div className="organizations-list">
      <div className="organizations-header">
        <h2>Organizations</h2>
        <div className="header-actions">
          <button
            onClick={state.fetchOrganizations}
            disabled={state.loading}
            className="refresh-btn"
          >
            {state.loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link href="/organizations/new" className="create-btn">
            + New Organization
          </Link>
        </div>
      </div>
      {state.error && <DaemonErrorMessage error={state.error} />}
      {state.showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this organization?</p>
          {state.deleteError && (
            <p className="delete-error-message">{state.deleteError}</p>
          )}
          <div className="delete-confirm-actions">
            <button
              onClick={() => {
                state.setShowDeleteConfirm(null)
                state.setDeleteError(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => state.handleDelete(state.showDeleteConfirm!)}
              disabled={state.deleting}
              className="confirm-delete-btn"
            >
              {state.deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
      {state.loading && state.organizations.length === 0 ? (
        <div className="loading">Loading organizations...</div>
      ) : state.organizations.length === 0 ? (
        <div className="empty-state">
          <p>No organizations found</p>
          <p>
            <Link href="/organizations/new">
              Create your first organization
            </Link>{' '}
            to group your projects
          </p>
        </div>
      ) : (
        <OrganizationsTable
          table={state.table}
          onContextMenu={state.handleContextMenu}
        />
      )}
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
