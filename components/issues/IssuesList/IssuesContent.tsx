'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Table as TanstackTable } from '@tanstack/react-table'
import type { RouteLiteral } from 'nextjs-routes'
import { IssuesTable } from './IssuesTable'
import type { Issue } from '@/gen/centy_pb'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface IssuesContentProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  error: string | null
  issues: Issue[]
  table: TanstackTable<Issue>
  statusOptions: MultiSelectOption[]
  createLink: (path: string) => RouteLiteral
  onContextMenu: (e: React.MouseEvent, issue: Issue) => void
}

export function IssuesContent({
  projectPath,
  isInitialized,
  loading,
  error,
  issues,
  table,
  statusOptions,
  createLink,
  onContextMenu,
}: IssuesContentProps): ReactElement {
  if (!projectPath) {
    return (
      <div className="no-project-message">
        <p className="no-project-text">
          Select a project from the header to view issues
        </p>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p className="not-initialized-text">
          Centy is not initialized in this directory
        </p>
        <Link href={createLink('/')}>Initialize Project</Link>
      </div>
    )
  }

  if (!(projectPath && isInitialized === true)) {
    return <></>
  }

  return (
    <>
      {error && <DaemonErrorMessage error={error} />}

      {loading && issues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No issues found</p>
          <Link href={createLink('/issues/new')}>Create your first issue</Link>
        </div>
      ) : (
        <IssuesTable
          table={table}
          statusOptions={statusOptions}
          onContextMenu={onContextMenu}
        />
      )}
    </>
  )
}
