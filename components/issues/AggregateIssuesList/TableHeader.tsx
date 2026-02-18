'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { PRIORITY_OPTIONS } from './utils'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'

interface TableHeaderProps {
  headerGroups: HeaderGroup<AggregateIssue>[]
  statusOptions: MultiSelectOption[]
}

function getFilterValue(column: { getFilterValue: () => unknown }) {
  const filterVal = column.getFilterValue()
  return Array.isArray(filterVal)
    ? filterVal.filter((v): v is string => typeof v === 'string')
    : []
}

// eslint-disable-next-line max-lines-per-function
export function TableHeader({
  headerGroups,
  statusOptions,
}: TableHeaderProps): ReactElement {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
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
                {header.column.getCanFilter() &&
                  (header.column.id === 'status' ? (
                    <MultiSelect
                      options={statusOptions}
                      value={getFilterValue(header.column)}
                      onChange={values =>
                        header.column.setFilterValue(
                          values.length > 0 ? values : undefined
                        )
                      }
                      placeholder="All"
                      className="column-filter-multi"
                    />
                  ) : header.column.id === 'priority' ? (
                    <MultiSelect
                      options={PRIORITY_OPTIONS}
                      value={getFilterValue(header.column)}
                      onChange={values =>
                        header.column.setFilterValue(
                          values.length > 0 ? values : undefined
                        )
                      }
                      placeholder="All"
                      className="column-filter-multi"
                    />
                  ) : (
                    <input
                      type="text"
                      className="column-filter"
                      placeholder="Filter..."
                      value={(() => {
                        const filterVal = header.column.getFilterValue()
                        return typeof filterVal === 'string' ? filterVal : ''
                      })()}
                      onChange={e =>
                        header.column.setFilterValue(e.target.value)
                      }
                    />
                  ))}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
