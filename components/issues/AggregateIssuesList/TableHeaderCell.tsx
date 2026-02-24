'use client'

import type { ReactElement } from 'react'
import type { Column, Header } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { PRIORITY_OPTIONS } from './utils'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'

function getFilterValue(column: { getFilterValue: () => unknown }) {
  const filterVal = column.getFilterValue()
  return Array.isArray(filterVal)
    ? filterVal.filter((v): v is string => typeof v === 'string')
    : []
}

export function getSortIndicator(sorted: false | 'asc' | 'desc'): string {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

interface HeaderCellFilterProps {
  column: Column<AggregateIssue>
  statusOptions: MultiSelectOption[]
}

export function HeaderCellFilter({
  column,
  statusOptions,
}: HeaderCellFilterProps): ReactElement | null {
  if (!column.getCanFilter()) return null
  if (column.id === 'status') {
    return (
      <MultiSelect
        options={statusOptions}
        value={getFilterValue(column)}
        onChange={values =>
          column.setFilterValue(values.length > 0 ? values : undefined)
        }
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  if (column.id === 'priority') {
    return (
      <MultiSelect
        options={PRIORITY_OPTIONS}
        value={getFilterValue(column)}
        onChange={values =>
          column.setFilterValue(values.length > 0 ? values : undefined)
        }
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  const filterVal = column.getFilterValue()
  return (
    <input
      type="text"
      className="column-filter"
      placeholder="Filter..."
      value={typeof filterVal === 'string' ? filterVal : ''}
      onChange={e => column.setFilterValue(e.target.value)}
    />
  )
}

export function HeaderCell({
  header,
  statusOptions,
}: {
  header: Header<AggregateIssue, unknown>
  statusOptions: MultiSelectOption[]
}): ReactElement {
  return (
    <th className="header-cell" key={header.id}>
      <div className="th-content">
        <button
          type="button"
          className={`sort-btn ${header.column.getIsSorted() ? 'sorted' : ''}`}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <span className="sort-indicator">
            {getSortIndicator(header.column.getIsSorted())}
          </span>
        </button>
        <HeaderCellFilter
          column={header.column}
          statusOptions={statusOptions}
        />
      </div>
    </th>
  )
}
