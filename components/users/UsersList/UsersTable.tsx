'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import type { User } from '@/gen/centy_pb'

interface UsersTableProps {
  table: Table<User>
  onContextMenu: (e: React.MouseEvent, user: User) => void
}

export function UsersTable({ table, onContextMenu }: UsersTableProps) {
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
                <td
                  key={cell.id}
                  className={
                    cell.column.id === 'name'
                      ? 'user-name'
                      : cell.column.id === 'email'
                        ? 'user-email'
                        : cell.column.id === 'createdAt'
                          ? 'user-date'
                          : ''
                  }
                >
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
