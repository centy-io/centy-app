/* eslint-disable max-lines */
'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import type { Organization } from '@/gen/centy_pb'

interface OrganizationsTableProps {
  table: Table<Organization>
  onContextMenu: (e: React.MouseEvent, org: Organization) => void
  onUntrack: (slug: string) => void
}

// eslint-disable-next-line max-lines-per-function
export function OrganizationsTable({
  table,
  onContextMenu,
  onUntrack,
}: OrganizationsTableProps) {
  return (
    <div className="organizations-table">
      <table className="orgs-data-table">
        <thead className="orgs-thead">
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="header-row" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className="header-cell" key={header.id}>
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
                        {(() => {
                          const sorted = header.column.getIsSorted()
                          return sorted === 'asc'
                            ? ' \u25B2'
                            : sorted === 'desc'
                              ? ' \u25BC'
                              : ''
                        })()}
                      </span>
                    </button>
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        className="column-filter"
                        placeholder="Filter..."
                        value={(() => {
                          const v = header.column.getFilterValue()
                          return typeof v === 'string' ? v : ''
                        })()}
                        onChange={e =>
                          header.column.setFilterValue(e.target.value)
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="header-cell actions-header">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody className="orgs-tbody">
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
              <td className="org-actions">
                <button
                  type="button"
                  className="untrack-btn"
                  onClick={() => onUntrack(row.original.slug)}
                >
                  Untrack
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
