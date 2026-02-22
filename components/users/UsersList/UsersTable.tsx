'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { type RouteLiteral } from 'nextjs-routes'
import { createUserColumns } from './columns'
import { type User } from '@/gen/centy_pb'
import { SortableTableHeader } from '@/components/shared/SortableTableHeader'

interface UsersTableProps {
  users: User[]
  getUserRoute: (userId: string) => RouteLiteral | '/'
  onContextMenu: (e: React.MouseEvent, user: User) => void
}

function getCellClassName(columnId: string) {
  if (columnId === 'name') return 'user-name'
  if (columnId === 'email') return 'user-email'
  if (columnId === 'createdAt') return 'user-date'
  return ''
}

export function UsersTable({
  users,
  getUserRoute,
  onContextMenu,
}: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useMemo(() => createUserColumns(), [])

  const table = useReactTable({
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

  return (
    <div className="users-table">
      <table className="users-data-table">
        <SortableTableHeader headerGroups={table.getHeaderGroups()} />
        <tbody className="users-tbody">
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
