'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
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
import { SyncUsersModal } from './SyncUsersModal'
import { centyClient } from '@/lib/grpc/client'
import {
  ListUsersRequestSchema,
  DeleteUserRequestSchema,
  IsInitializedRequestSchema,
  type User,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

const columnHelper = createColumnHelper<User>()

function getCellClassName(columnId: string) {
  if (columnId === 'name') return 'user-name'
  if (columnId === 'email') return 'user-email'
  if (columnId === 'createdAt') return 'user-date'
  return ''
}

interface UsersTableProps {
  table: ReturnType<typeof useReactTable<User>>
  onContextMenu: (e: React.MouseEvent, user: User) => void
}

function UsersTable({ table, onContextMenu }: UsersTableProps) {
  return (
    <div className="users-table">
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
                          asc: ' \u25B2',
                          desc: ' \u25BC',
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
              key={row.original.id}
              onContextMenu={e => onContextMenu(e, row.original)}
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

interface UsersInitializedContentProps {
  error: string | null
  showDeleteConfirm: string | null
  setShowDeleteConfirm: (v: string | null) => void
  handleDelete: (userId: string) => void
  deleting: boolean
  loading: boolean
  users: User[]
  newUserRoute: RouteLiteral | '/'
  setShowSyncModal: (v: boolean) => void
  table: ReturnType<typeof useReactTable<User>>
  onContextMenu: (e: React.MouseEvent, user: User) => void
}

function UsersInitializedContent({
  error,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  deleting,
  loading,
  users,
  newUserRoute,
  setShowSyncModal,
  table,
  onContextMenu,
}: UsersInitializedContentProps) {
  return (
    <>
      {error && <DaemonErrorMessage error={error} />}

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this user?</p>
          <div className="delete-confirm-actions">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(showDeleteConfirm)}
              disabled={deleting}
              className="confirm-delete-btn"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
          <p>
            <Link href={newUserRoute}>Create your first user</Link> or{' '}
            <button
              onClick={() => setShowSyncModal(true)}
              className="sync-link-btn"
            >
              sync from git history
            </button>
          </p>
        </div>
      ) : (
        <UsersTable table={table} onContextMenu={onContextMenu} />
      )}
    </>
  )
}

function useUserColumns() {
  return useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => {
          const meta = info.table.options.meta as {
            getUserRoute: (userId: string) => RouteLiteral | '/'
          }
          return (
            <Link
              href={meta.getUserRoute(info.row.original.id)}
              className="user-name-link"
            >
              {info.getValue()}
            </Link>
          )
        },
        enableColumnFilter: true,
        filterFn: 'includesString',
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue() || '-',
        enableColumnFilter: true,
        filterFn: 'includesString',
      }),
      columnHelper.accessor('gitUsernames', {
        header: 'Git Usernames',
        cell: info => {
          const usernames = info.getValue()
          return usernames.length > 0 ? usernames.join(', ') : '-'
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const usernames = row.getValue(columnId) as string[]
          return usernames.some(u =>
            u.toLowerCase().includes(filterValue.toLowerCase())
          )
        },
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
    ],
    []
  )
}

function useCheckInitialized(setIsInitialized: (v: boolean | null) => void) {
  return useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )
}

function useFetchUsers(projectPath: string, isInitialized: boolean | null) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListUsersRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listUsers(request)
      setUsers(response.users)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      if (isDaemonUnimplemented(message)) {
        setError(
          'User management is not yet available. Please update your daemon to the latest version.'
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  return { users, setUsers, loading, error, setError, fetchUsers }
}

function useDeleteUser(
  projectPath: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setError: (e: string | null) => void
) {
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )

  const handleDelete = useCallback(
    async (userId: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const request = create(DeleteUserRequestSchema, { projectPath, userId })
        const response = await centyClient.deleteUser(request)
        if (response.success) {
          setUsers(prev => prev.filter(u => u.id !== userId))
          setShowDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete user')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, setUsers, setError]
  )

  return { deleting, showDeleteConfirm, setShowDeleteConfirm, handleDelete }
}

function useContextMenuItems(
  contextMenu: { x: number; y: number; user: User } | null,
  router: ReturnType<typeof useRouter>,
  getUserRoute: (userId: string) => RouteLiteral | '/',
  setContextMenu: (v: null) => void,
  setShowDeleteConfirm: (v: string) => void
): ContextMenuItem[] {
  if (!contextMenu) return []
  return [
    {
      label: 'View',
      onClick: () => {
        router.push(getUserRoute(contextMenu.user.id))
        setContextMenu(null)
      },
    },
    {
      label: 'Edit',
      onClick: () => {
        router.push(getUserRoute(contextMenu.user.id))
        setContextMenu(null)
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        setShowDeleteConfirm(contextMenu.user.id)
        setContextMenu(null)
      },
      danger: true,
    },
  ]
}

function UsersListHeader({
  projectPath,
  isInitialized,
  loading,
  fetchUsers,
  setShowSyncModal,
  newUserRoute,
}: {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  fetchUsers: () => void
  setShowSyncModal: (v: boolean) => void
  newUserRoute: RouteLiteral | '/'
}) {
  return (
    <div className="users-header">
      <h2>Users</h2>
      <div className="header-actions">
        {projectPath && isInitialized === true && (
          <>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button onClick={() => setShowSyncModal(true)} className="sync-btn">
              Sync from Git
            </button>
          </>
        )}
        <Link href={newUserRoute} className="create-btn">
          + New User
        </Link>
      </div>
    </div>
  )
}

function useListProjectContext(params: ReturnType<typeof useParams>) {
  const projectContext = useMemo(() => {
    const org = params ? (params.organization as string | undefined) : undefined
    const project = params ? (params.project as string | undefined) : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])

  const getUserRoute = useCallback(
    (userId: string): RouteLiteral | '/' => {
      if (projectContext) {
        return route({
          pathname: '/[organization]/[project]/users/[userId]',
          query: { ...projectContext, userId },
        })
      }
      return '/'
    },
    [projectContext]
  )

  const newUserRoute: RouteLiteral | '/' = useMemo(() => {
    if (projectContext) {
      return route({
        pathname: '/[organization]/[project]/users/new',
        query: projectContext,
      })
    }
    return '/'
  }, [projectContext])

  return { projectContext, getUserRoute, newUserRoute }
}

function useUsersTable(
  users: User[],
  getUserRoute: (userId: string) => RouteLiteral | '/'
) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useUserColumns()

  return useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { getUserRoute },
  })
}

function useUsersListEffects(
  projectPath: string,
  isInitialized: boolean | null,
  setIsInitialized: (v: boolean | null) => void,
  fetchUsers: () => void
) {
  const checkInitialized = useCheckInitialized(setIsInitialized)
  useEffect(() => {
    const t = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(t)
  }, [projectPath, checkInitialized])
  useEffect(() => {
    if (isInitialized === true) fetchUsers()
  }, [isInitialized, fetchUsers])
}

function UsersListBody({
  projectPath,
  isInitialized,
  error,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  deleting,
  loading,
  users,
  newUserRoute,
  setShowSyncModal,
  table,
  handleContextMenu,
}: {
  projectPath: string
  isInitialized: boolean | null
  error: string | null
  showDeleteConfirm: string | null
  setShowDeleteConfirm: (v: string | null) => void
  handleDelete: (userId: string) => void
  deleting: boolean
  loading: boolean
  users: User[]
  newUserRoute: RouteLiteral | '/'
  setShowSyncModal: (v: boolean) => void
  table: ReturnType<typeof useReactTable<User>>
  handleContextMenu: (e: React.MouseEvent, user: User) => void
}) {
  return (
    <>
      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view users</p>
        </div>
      )}
      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}
      {projectPath && isInitialized === true && (
        <UsersInitializedContent
          error={error}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDelete={handleDelete}
          deleting={deleting}
          loading={loading}
          users={users}
          newUserRoute={newUserRoute}
          setShowSyncModal={setShowSyncModal}
          table={table}
          onContextMenu={handleContextMenu}
        />
      )}
    </>
  )
}

function useUsersListInteractions(
  router: ReturnType<typeof useRouter>,
  getUserRoute: (userId: string) => RouteLiteral | '/',
  setShowDeleteConfirm: (v: string) => void,
  fetchUsers: () => void
) {
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    user: User
  } | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, user: User) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, user })
  }, [])
  const handleSynced = useCallback(
    (createdCount: number) => {
      if (createdCount > 0) fetchUsers()
      setShowSyncModal(false)
    },
    [fetchUsers]
  )
  const contextMenuItems = useContextMenuItems(
    contextMenu,
    router,
    getUserRoute,
    () => setContextMenu(null),
    setShowDeleteConfirm
  )

  return {
    showSyncModal,
    setShowSyncModal,
    contextMenu,
    setContextMenu,
    handleContextMenu,
    handleSynced,
    contextMenuItems,
  }
}

export function UsersList() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const { getUserRoute, newUserRoute } = useListProjectContext(params)

  const { users, setUsers, loading, error, setError, fetchUsers } =
    useFetchUsers(projectPath, isInitialized)
  const { deleting, showDeleteConfirm, setShowDeleteConfirm, handleDelete } =
    useDeleteUser(projectPath, setUsers, setError)

  const table = useUsersTable(users, getUserRoute)
  useUsersListEffects(projectPath, isInitialized, setIsInitialized, fetchUsers)

  const interactions = useUsersListInteractions(
    router,
    getUserRoute,
    setShowDeleteConfirm,
    fetchUsers
  )

  return (
    <div className="users-list">
      <UsersListHeader
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={loading}
        fetchUsers={fetchUsers}
        setShowSyncModal={interactions.setShowSyncModal}
        newUserRoute={newUserRoute}
      />
      <UsersListBody
        projectPath={projectPath}
        isInitialized={isInitialized}
        error={error}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleDelete={handleDelete}
        deleting={deleting}
        loading={loading}
        users={users}
        newUserRoute={newUserRoute}
        setShowSyncModal={interactions.setShowSyncModal}
        table={table}
        handleContextMenu={interactions.handleContextMenu}
      />
      {interactions.contextMenu && (
        <ContextMenu
          items={interactions.contextMenuItems}
          x={interactions.contextMenu.x}
          y={interactions.contextMenu.y}
          onClose={() => interactions.setContextMenu(null)}
        />
      )}
      {interactions.showSyncModal && (
        <SyncUsersModal
          onClose={() => interactions.setShowSyncModal(false)}
          onSynced={interactions.handleSynced}
        />
      )}
    </div>
  )
}
