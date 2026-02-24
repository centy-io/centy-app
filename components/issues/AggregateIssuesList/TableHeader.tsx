'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import type { AggregateIssue } from './AggregateIssuesList.types'
import { HeaderCell } from './TableHeaderCell'
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
            <HeaderCell
              key={header.id}
              header={header}
              statusOptions={statusOptions}
            />
          ))}
        </tr>
      ))}
    </thead>
  )
}
