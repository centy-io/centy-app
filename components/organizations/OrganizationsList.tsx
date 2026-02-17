'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

const columnHelper = createColumnHelper<Organization>()

function DeleteConfirmDialog({
  deleteError,
  deleting,
  onCancel,
  onConfirm,
}: {
  deleteError: string | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this organization?</p>
      {deleteError && <p className="delete-error-message">{deleteError}</p>}
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

function getCellClassName(columnId: string) {
  if (columnId === 'name') return 'org-name'
  if (columnId === 'slug') return 'org-slug'
  if (columnId === 'projectCount') return 'org-projects'
  if (columnId === 'createdAt') return 'org-date'
  return ''
}

function OrganizationsTable({
  table,
  handleContextMenu,
}: {
  table: ReturnType<typeof useReactTable<Organization>>
  handleContextMenu: (e: React.MouseEvent, org: Organization) => void
}) {
  return (
    <div className="organizations-table">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  <div className="th-content">
                    <button
                      type="button"
                      className={`sort-btn ${header.column.getIsSorted() ? 'sorted' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="sort-indicator">
                        {{
                          asc: ' ▲',
                          desc: ' ▼',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </span>
                    </button>
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        className="column-filter"
                        placeholder="Filter..."
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={e =>
                          header.column.setFilterValue(e.target.value)
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.original.slug}
              onContextMenu={e => handleContextMenu(e, row.original)}
              className="context-menu-row"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={getCellClassName(cell.column.id)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function buildColumns() {
  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <Link
          href={route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: info.row.original.slug },
          })}
          className="org-name-link"
        >
          {info.getValue()}
        </Link>
      ),
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: info => <code className="org-slug-badge">{info.getValue()}</code>,
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => {
        const desc = info.getValue()
        if (!desc) return <span className="text-muted">-</span>
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
      },
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('projectCount', {
      header: 'Projects',
      cell: info => (
        <span className="org-project-count">{info.getValue()}</span>
      ),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: info => {
        const date = info.getValue()
        return date ? new Date(date).toLocaleDateString() : '-'
      },
      enableColumnFilter: false,
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('createdAt') as string
        const b = rowB.getValue('createdAt') as string
        if (!a && !b) return 0
        if (!a) return 1
        if (!b) return -1
        return new Date(a).getTime() - new Date(b).getTime()
      },
    }),
  ]
}

async function fetchOrganizationsData(
  setOrganizations: (orgs: Organization[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true)
  setError(null)

  try {
    const request = create(ListOrganizationsRequestSchema, {})
    const response = await centyClient.listOrganizations(request)
    setOrganizations(response.organizations)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    if (isDaemonUnimplemented(message)) {
      setError(
        'Organizations feature is not available. Please update your daemon.'
      )
    } else {
      setError(message)
    }
  } finally {
    setLoading(false)
  }
}

async function deleteOrganizationAction(
  slug: string,
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  setShowDeleteConfirm: (slug: string | null) => void,
  setDeleteError: (error: string | null) => void,
  setDeleting: (deleting: boolean) => void
) {
  setDeleting(true)
  setDeleteError(null)

  try {
    const request = create(DeleteOrganizationRequestSchema, { slug })
    const response = await centyClient.deleteOrganization(request)

    if (response.success) {
      setOrganizations(prev => prev.filter(o => o.slug !== slug))
      setShowDeleteConfirm(null)
    } else {
      setDeleteError(response.error || 'Failed to delete organization')
    }
  } catch (err) {
    setDeleteError(
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    )
  } finally {
    setDeleting(false)
  }
}

function buildContextMenuItems(
  contextMenu: { x: number; y: number; org: Organization },
  router: ReturnType<typeof useRouter>,
  setContextMenu: (menu: null) => void,
  setShowDeleteConfirm: (slug: string) => void
): ContextMenuItem[] {
  return [
    {
      label: 'View',
      onClick: () => {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: contextMenu.org.slug },
          })
        )
        setContextMenu(null)
      },
    },
    {
      label: 'Edit',
      onClick: () => {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: contextMenu.org.slug },
          })
        )
        setContextMenu(null)
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        setShowDeleteConfirm(contextMenu.org.slug)
        setContextMenu(null)
      },
      danger: true,
    },
  ]
}

function OrganizationsListContent({
  organizations,
  loading,
  table,
  handleContextMenu,
}: {
  organizations: Organization[]
  loading: boolean
  table: ReturnType<typeof useReactTable<Organization>>
  handleContextMenu: (e: React.MouseEvent, org: Organization) => void
}) {
  if (loading && organizations.length === 0) {
    return <div className="loading">Loading organizations...</div>
  }

  if (organizations.length === 0) {
    return (
      <div className="empty-state">
        <p>No organizations found</p>
        <p>
          <Link href="/organizations/new">Create your first organization</Link>{' '}
          to group your projects
        </p>
      </div>
    )
  }

  return (
    <OrganizationsTable table={table} handleContextMenu={handleContextMenu} />
  )
}

function useOrganizationsTable(organizations: Organization[]) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useMemo(() => buildColumns(), [])

  return useReactTable({
    data: organizations,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
}

function useOrganizationsListState() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    org: Organization
  } | null>(null)
  const table = useOrganizationsTable(organizations)

  const fetchOrganizations = useCallback(async () => {
    await fetchOrganizationsData(setOrganizations, setError, setLoading)
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = useCallback(async (slug: string) => {
    await deleteOrganizationAction(
      slug,
      setOrganizations,
      setShowDeleteConfirm,
      setDeleteError,
      setDeleting
    )
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, org: Organization) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, org })
    },
    []
  )

  const contextMenuItems: ContextMenuItem[] = contextMenu
    ? buildContextMenuItems(
        contextMenu,
        router,
        setContextMenu,
        setShowDeleteConfirm
      )
    : []

  return {
    organizations,
    loading,
    error,
    deleting,
    showDeleteConfirm,
    deleteError,
    contextMenu,
    table,
    fetchOrganizations,
    handleDelete,
    handleContextMenu,
    contextMenuItems,
    setShowDeleteConfirm,
    setDeleteError,
    setContextMenu,
  }
}

export function OrganizationsList() {
  const state = useOrganizationsListState()

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
        <DeleteConfirmDialog
          deleteError={state.deleteError}
          deleting={state.deleting}
          onCancel={() => {
            state.setShowDeleteConfirm(null)
            state.setDeleteError(null)
          }}
          onConfirm={() => state.handleDelete(state.showDeleteConfirm!)}
        />
      )}

      <OrganizationsListContent
        organizations={state.organizations}
        loading={state.loading}
        table={state.table}
        handleContextMenu={state.handleContextMenu}
      />

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
