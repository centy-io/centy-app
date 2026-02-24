'use client'

import type { ReactElement } from 'react'
import type { HeaderGroup } from '@tanstack/react-table'
import { IssueHeaderCell } from './IssuesHeaderCell'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import type { Issue } from '@/gen/centy_pb'

interface IssuesTableHeaderProps {
  headerGroups: HeaderGroup<Issue>[]
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
            <IssueHeaderCell
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
