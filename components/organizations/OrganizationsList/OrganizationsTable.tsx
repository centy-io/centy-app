'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import { OrgTableHeader } from './OrgTableHeader'
import { getCellClassName } from './tableHelpers'
import type { Organization } from '@/gen/centy_pb'

interface OrganizationsTableProps {
  table: Table<Organization>
  onContextMenu: (e: React.MouseEvent, org: Organization) => void
  onUntrack: (slug: string) => void
}

export function OrganizationsTable({
  table,
  onContextMenu,
  onUntrack,
}: OrganizationsTableProps): React.JSX.Element {
  return (
    <div className="organizations-table">
      <table className="orgs-data-table">
        <OrgTableHeader table={table} />
        <tbody className="orgs-tbody">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.original.slug}
              onContextMenu={e => onContextMenu(e, row.original)}
              className="context-menu-row"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={getCellClassName(cell.column.id)}>
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
