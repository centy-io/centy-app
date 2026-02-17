'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import type { Organization } from '@/gen/centy_pb'

interface OrgsTableProps {
  table: Table<Organization>
  onContextMenu: (e: React.MouseEvent, org: Organization) => void
}

export function OrgsTable({ table, onContextMenu }: OrgsTableProps) {
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
                        {{ asc: ' \u25B2', desc: ' \u25BC' }[
                          header.column.getIsSorted() as string
                        ] ?? ''}
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
              onContextMenu={e => onContextMenu(e, row.original)}
              className="context-menu-row"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={
                    cell.column.id === 'name'
                      ? 'org-name'
                      : cell.column.id === 'slug'
                        ? 'org-slug'
                        : cell.column.id === 'projectCount'
                          ? 'org-projects'
                          : cell.column.id === 'createdAt'
                            ? 'org-date'
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
