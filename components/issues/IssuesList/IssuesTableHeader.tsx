'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { IssuesColumnFilter, getSortIndicator } from './IssuesColumnFilter'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import type { GenericItem } from '@/gen/centy_pb'

interface IssuesTableHeaderProps {
  headerGroups: HeaderGroup<GenericItem>[]
  statusOptions: MultiSelectOption[]
}

export function IssuesTableHeader({
  headerGroups,
  statusOptions,
}: IssuesTableHeaderProps): ReactElement {
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
                <IssuesColumnFilter
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
