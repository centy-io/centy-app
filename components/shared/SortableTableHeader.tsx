'use client'

import { flexRender, type HeaderGroup } from '@tanstack/react-table'

function getSortIndicator(sorted: false | 'asc' | 'desc') {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

interface SortableTableHeaderProps<T> {
  headerGroups: HeaderGroup<T>[]
}

export function SortableTableHeader<T>({
  headerGroups,
}: SortableTableHeaderProps<T>) {
  return (
    <thead className="sortable-thead">
      {headerGroups.map(hg => (
        <tr className="header-row" key={hg.id}>
          {hg.headers.map(header => (
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
                    value={(() => {
                      const v = header.column.getFilterValue()
                      return typeof v === 'string' ? v : ''
                    })()}
                    onChange={e => header.column.setFilterValue(e.target.value)}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
