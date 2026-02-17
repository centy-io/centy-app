import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import type { Table } from '@tanstack/react-table'
import type { Issue } from '@/gen/centy_pb'
import type { MultiSelectOption } from '@/components/shared/MultiSelect'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { IssuesTable } from './IssuesTable'

interface IssuesListContentProps {
  projectPath: string
  isInitialized: boolean | null
  issues: Issue[]
  loading: boolean
  error: string | null
  table: Table<Issue>
  statusOptions: MultiSelectOption[]
  createLink: (path: string) => RouteLiteral
  onContextMenu: (e: React.MouseEvent, issue: Issue) => void
}

export function IssuesListContent({
  projectPath,
  isInitialized,
  issues,
  loading,
  error,
  table,
  statusOptions,
  createLink,
  onContextMenu,
}: IssuesListContentProps) {
  if (!projectPath) {
    return (
      <div className="no-project-message">
        <p>Select a project from the header to view issues</p>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p>Centy is not initialized in this directory</p>
        <Link href={createLink('/')}>Initialize Project</Link>
      </div>
    )
  }

  if (isInitialized !== true) {
    return null
  }

  return (
    <>
      {error && <DaemonErrorMessage error={error} />}
      {loading && issues.length === 0 ? (
        <div className="loading">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <p>No issues found</p>
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
