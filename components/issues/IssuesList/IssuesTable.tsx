'use client'

import type { ReactElement } from 'react'
import type { Table as TanstackTable } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { IssuesTableHeader } from './IssuesTableHeader'
import type { Issue } from '@/gen/centy_pb'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'

interface IssuesTableProps {
  table: TanstackTable<Issue>
  statusOptions: MultiSelectOption[]
  onContextMenu: (e: React.MouseEvent, issue: Issue) => void
}

function getCellClassName(columnId: string): string {
  if (columnId === 'displayNumber') return 'issue-number'
  if (columnId === 'title') return 'issue-title'
  if (columnId === 'createdAt') return 'issue-date'
  return ''
}

export function IssuesTable({
  table,
  statusOptions,
  onContextMenu,
}: IssuesTableProps): ReactElement {
  return (
    <div className="issues-table">
      <table className="issues-data-table">
        <IssuesTableHeader
          headerGroups={table.getHeaderGroups()}
          statusOptions={statusOptions}
        />
        <tbody className="issues-tbody">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.original.issueNumber}
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
