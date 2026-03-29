'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import {
  AggregateColumnFilter,
  getSortIndicator,
} from './AggregateColumnFilter'
import type { AggregateIssue } from './AggregateIssuesList.types'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'

interface TableHeaderProps {
  headerGroups: HeaderGroup<AggregateIssue>[]
  statusOptions: MultiSelectOption[]
}

export function TableHeader({
  headerGroups,
  statusOptions,
}: TableHeaderProps): ReactElement {
  return (
    <thead className="issues-thead">
      {headerGroups.map(headerGroup => (
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
                <AggregateColumnFilter
                  column={header.column}
                  statusOptions={statusOptions}
                />
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
