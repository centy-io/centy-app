'use client'

import { flexRender, type Table, type Header } from '@tanstack/react-table'
import type { Organization } from '@/gen/centy_pb'

interface OrganizationsTableProps {
  table: Table<Organization>
  onContextMenu: (e: React.MouseEvent, org: Organization) => void
}

function getSortIndicator(sorted: string | false) {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

function getCellClass(columnId: string) {
  if (columnId === 'name') return 'org-name'
  if (columnId === 'slug') return 'org-slug'
  if (columnId === 'projectCount') return 'org-projects'
  if (columnId === 'createdAt') return 'org-date'
  return ''
}

function TableHeaderCell({
  header,
}: {
  header: Header<Organization, unknown>
}) {
  const filterVal = header.column.getFilterValue()
  return (
    <th className="header-cell" key={header.id}>
      <div className="th-content">
        <button
          type="button"
          className={`sort-btn ${header.column.getIsSorted() ? 'sorted' : ''}`}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <span className="sort-indicator">
            {getSortIndicator(header.column.getIsSorted())}
          </span>
        </button>
        {header.column.getCanFilter() && (
          <input
            type="text"
            className="column-filter"
            placeholder="Filter..."
            value={typeof filterVal === 'string' ? filterVal : ''}
            onChange={e => header.column.setFilterValue(e.target.value)}
          />
        )}
      </div>
    </th>
  )
}

export function OrganizationsTable({
  table,
  onContextMenu,
}: OrganizationsTableProps) {
  return (
    <div className="organizations-table">
      <table className="orgs-data-table">
        <thead className="orgs-thead">
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="header-row" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHeaderCell key={header.id} header={header} />
              ))}
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
                <td key={cell.id} className={getCellClass(cell.column.id)}>
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
