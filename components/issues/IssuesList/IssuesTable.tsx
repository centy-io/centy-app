import { flexRender, type Table } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { IssueColumnFilter } from './IssueColumnFilter'

interface IssuesTableProps {
  table: Table<Issue>
  statusOptions: MultiSelectOption[]
  onContextMenu: (e: React.MouseEvent, issue: Issue) => void
}

function getCellClassName(columnId: string): string {
  switch (columnId) {
    case 'displayNumber':
      return 'issue-number'
    case 'title':
      return 'issue-title'
    case 'createdAt':
      return 'issue-date'
    default:
      return ''
  }
}

export function IssuesTable({
  table,
  statusOptions,
  onContextMenu,
}: IssuesTableProps) {
  return (
    <div className="issues-table">
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
                      <IssueColumnFilter
                        header={header}
                        statusOptions={statusOptions}
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
