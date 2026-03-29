'use client'

import { flexRender, type Table } from '@tanstack/react-table'
import { getSortIndicator } from './getSortIndicator'
import { getColumnFilterValue } from './getColumnFilterValue'
import type { Organization } from '@/gen/centy_pb'

interface OrgTableHeaderProps {
  table: Table<Organization>
}

export function OrgTableHeader({
  table,
}: OrgTableHeaderProps): React.JSX.Element {
  return (
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
                    {getSortIndicator(header.column.getIsSorted())}
                  </span>
                </button>
                {header.column.getCanFilter() && (
                  <input
                    type="text"
                    className="column-filter"
                    placeholder="Filter..."
                    value={getColumnFilterValue(header)}
                    onChange={e => header.column.setFilterValue(e.target.value)}
                  />
                )}
              </div>
            </th>
          ))}
          <th className="header-cell actions-header">Actions</th>
        </tr>
      ))}
    </thead>
  )
}
