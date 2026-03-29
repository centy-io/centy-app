'use client'

import type { ReactElement } from 'react'
import type { Column } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { PRIORITY_OPTIONS } from './utils'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'

export function getFilterValue(column: {
  getFilterValue: () => unknown
}): string[] {
  const filterVal = column.getFilterValue()
  return Array.isArray(filterVal)
    ? filterVal.filter((v): v is string => typeof v === 'string')
    : []
}

export function getSortIndicator(sorted: string | boolean): string {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}

export function getTextFilterValue(column: {
  getFilterValue: () => unknown
}): string {
  const filterVal = column.getFilterValue()
  return typeof filterVal === 'string' ? filterVal : ''
}

interface AggregateColumnFilterProps {
  column: Column<AggregateIssue>
  statusOptions: MultiSelectOption[]
}

export function AggregateColumnFilter({
  column,
  statusOptions,
}: AggregateColumnFilterProps): ReactElement | null {
  if (!column.getCanFilter()) return null
  const onMultiChange = (values: string[]): void => {
    column.setFilterValue(values.length > 0 ? values : undefined)
  }
  if (column.id === 'status') {
    return (
      <MultiSelect
        options={statusOptions}
        value={getFilterValue(column)}
        onChange={onMultiChange}
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
        onChange={onMultiChange}
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  return (
    <input
      type="text"
      className="column-filter"
      placeholder="Filter..."
      value={getTextFilterValue(column)}
      onChange={e => column.setFilterValue(e.target.value)}
    />
  )
}
