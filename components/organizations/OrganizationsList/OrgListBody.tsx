'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import type { useOrganizationsList } from './useOrganizationsList'
import { OrganizationsTable } from './OrganizationsTable'

type OrganizationsListState = ReturnType<typeof useOrganizationsList>

interface OrgListBodyProps {
  state: OrganizationsListState
}

export function OrgListBody({ state }: OrgListBodyProps): React.JSX.Element {
  if (state.loading && state.organizations.length === 0) {
    return <div className="loading">Loading organizations...</div>
  }
  if (state.organizations.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No organizations found</p>
        <p className="empty-state-hint">
          <Link href={route({ pathname: '/organizations/new' })}>
            Create your first organization
          </Link>{' '}
          to group your projects
        </p>
      </div>
    )
  }
  return (
    <OrganizationsTable
      table={state.table}
      onContextMenu={state.handleContextMenu}
      onUntrack={state.setShowDeleteConfirm}
    />
  )
}
