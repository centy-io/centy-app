'use client'

import type { ReactElement, RefObject } from 'react'
import type { Issue } from '@/gen/centy_pb'
import { AssigneeSelector } from '@/components/users/AssigneeSelector'
import { StatusDropdown } from './StatusDropdown'
import { getPriorityClass } from './IssueDetail.types'

interface MetadataProps {
  issue: Issue
  projectPath: string
  issueNumber: string
  stateManager: { getStateClass: (status: string) => string }
  stateOptions: { value: string; label: string }[]
  showStatusDropdown: boolean
  updatingStatus: boolean
  statusDropdownRef: RefObject<HTMLDivElement | null>
  assignees: string[]
  setAssignees: (assignees: string[]) => void
  onToggleDropdown: () => void
  onStatusChange: (status: string) => void
}

export function Metadata({
  issue,
  projectPath,
  issueNumber,
  stateManager,
  stateOptions,
  showStatusDropdown,
  updatingStatus,
  statusDropdownRef,
  assignees,
  setAssignees,
  onToggleDropdown,
  onStatusChange,
}: MetadataProps): ReactElement {
  const priorityLabel = (issue.metadata && issue.metadata.priorityLabel) || ''
  return (
    <>
      <div className="issue-metadata">
        <StatusDropdown
          issue={issue}
          stateManager={stateManager}
          stateOptions={stateOptions}
          showStatusDropdown={showStatusDropdown}
          updatingStatus={updatingStatus}
          statusDropdownRef={statusDropdownRef}
          onToggleDropdown={onToggleDropdown}
          onStatusChange={onStatusChange}
        />
        <span className={`priority-badge ${getPriorityClass(priorityLabel)}`}>
          {priorityLabel || 'unknown'}
        </span>
        <span className="issue-date">
          Created:{' '}
          {issue.metadata && issue.metadata.createdAt
            ? new Date(issue.metadata.createdAt).toLocaleString()
            : '-'}
        </span>
        {issue.metadata && issue.metadata.updatedAt && (
          <span className="issue-date">
            Updated: {new Date(issue.metadata.updatedAt).toLocaleString()}
          </span>
        )}
      </div>

      <div className="issue-assignees">
        <h4>Assignees</h4>
        <AssigneeSelector
          projectPath={projectPath}
          issueId={issueNumber}
          currentAssignees={assignees}
          onAssigneesChange={setAssignees}
        />
      </div>
    </>
  )
}
