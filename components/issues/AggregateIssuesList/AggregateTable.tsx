'use client'

import type { ReactElement } from 'react'
import type { Table as TanstackTable } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { TableHeader } from './TableHeader'

interface AggregateTableProps {
  table: TanstackTable<AggregateIssue>
  statusOptions: MultiSelectOption[]
}

function getCellClassName(columnId: string): string {
  if (columnId === 'displayNumber') return 'issue-number'
  if (columnId === 'title') return 'issue-title'
  if (columnId === 'createdAt') return 'issue-date'
  if (columnId === 'projectName') return 'project-name'
  return ''
}

export function AggregateTable({
  table,
  statusOptions,
}: AggregateTableProps): ReactElement {
  return (
    <div className="issues-table">
      <table>
        <TableHeader
          headerGroups={table.getHeaderGroups()}
          statusOptions={statusOptions}
        />
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={`${row.original.projectPath}-${row.original.issueNumber}`}>
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
