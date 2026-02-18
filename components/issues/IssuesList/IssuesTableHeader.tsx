'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'
import type { Issue } from '@/gen/centy_pb'
import { PRIORITY_OPTIONS } from './IssuesList.types'

interface IssuesTableHeaderProps {
  headerGroups: HeaderGroup<Issue>[]
  statusOptions: MultiSelectOption[]
}

function getFilterValue(column: { getFilterValue: () => unknown }) {
  const filterVal = column.getFilterValue()
  return Array.isArray(filterVal)
    ? filterVal.filter((v): v is string => typeof v === 'string')
    : []
}

export function IssuesTableHeader({
  headerGroups,
  statusOptions,
}: IssuesTableHeaderProps): ReactElement {
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
