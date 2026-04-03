'use client'

import type { ReactElement, RefObject } from 'react'
import { StatusDropdown } from './StatusDropdown'
import type { GenericItem } from '@/gen/centy_pb'
import { AssigneeSelector } from '@/components/users/AssigneeSelector'
import { ItemMetadata } from '@/components/shared/ItemMetadata'

interface MetadataProps {
  issue: GenericItem
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
  return (
    <>
      <ItemMetadata
        statusNode={
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
        }
        priority={issue.metadata ? issue.metadata.priority : undefined}
        priorityLabel={
          issue.metadata
            ? issue.metadata.customFields.priority_label || undefined
            : undefined
        }
        createdAt={issue.metadata ? issue.metadata.createdAt : undefined}
        updatedAt={issue.metadata ? issue.metadata.updatedAt : undefined}
      />
      <div className="issue-assignees">
        <h4 className="assignees-title">Assignees</h4>
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
