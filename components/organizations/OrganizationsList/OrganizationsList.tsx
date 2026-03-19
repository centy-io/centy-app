/* eslint-disable max-lines */
'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useOrganizationsList } from './useOrganizationsList'
import { OrganizationsTable } from './OrganizationsTable'
import { ContextMenu } from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'projects-desc', label: 'Most Projects' },
  { value: 'projects-asc', label: 'Fewest Projects' },
]

// eslint-disable-next-line max-lines-per-function
export function OrganizationsList() {
  const state = useOrganizationsList()
  const cascadeOrg = state.showCascadeConfirm
    ? state.organizations.find(o => o.slug === state.showCascadeConfirm)
    : undefined
  const cascadeProjectCount =
    cascadeOrg !== undefined ? cascadeOrg.projectCount : 0

  return (
    <div className="organizations-list">
      <div className="organizations-header">
        <h2 className="organizations-title">Organizations</h2>
        <div className="header-actions">
          <button
            onClick={state.fetchOrganizations}
            disabled={state.loading}
            className="refresh-btn"
          >
            {state.loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            href={route({ pathname: '/organizations/new' })}
            className="create-btn"
          >
            + New Organization
          </Link>
        </div>
      </div>
      <div className="organizations-toolbar">
        <div className="sort-control">
          <label className="sort-label" htmlFor="orgs-sort-select">
            Sort by
          </label>
          <select
            id="orgs-sort-select"
            className="sort-select"
            value={state.sortPreset}
            onChange={e => state.setSortPreset(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="sort-option">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.error && <DaemonErrorMessage error={state.error} />}
      {state.showDeleteConfirm && (
        <div className="delete-confirm">
          <p className="delete-confirm-message">
            Are you sure you want to untrack this organization?
          </p>
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
              {state.deleting ? 'Untracking...' : 'Yes, Untrack'}
            </button>
          </div>
        </div>
      )}
      {state.showCascadeConfirm && (
        <div className="delete-confirm">
          <p className="delete-confirm-message">
            This organization has {cascadeProjectCount} project
            {cascadeProjectCount !== 1 ? 's' : ''}. Untracking it will also
            untrack all of its projects. Do you want to continue?
          </p>
          {state.deleteError && (
            <p className="delete-error-message">{state.deleteError}</p>
          )}
          <div className="delete-confirm-actions">
            <button
              onClick={() => {
                state.setShowCascadeConfirm(null)
                state.setDeleteError(null)
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                state.handleDeleteCascade(state.showCascadeConfirm!)
              }
              disabled={state.deleting}
              className="confirm-delete-btn"
            >
              {state.deleting ? 'Untracking...' : 'Yes, Untrack All'}
            </button>
          </div>
        </div>
      )}
      {state.loading && state.organizations.length === 0 ? (
        <div className="loading">Loading organizations...</div>
      ) : state.organizations.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No organizations found</p>
          <p className="empty-state-hint">
            <Link href={route({ pathname: '/organizations/new' })}>
              Create your first organization
            </Link>{' '}
            to group your projects
          </p>
        </div>
      ) : (
        <OrganizationsTable
          table={state.table}
          onContextMenu={state.handleContextMenu}
          onUntrack={state.setShowDeleteConfirm}
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
