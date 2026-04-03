'use client'

import { Metadata } from './Metadata'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'
import { LinkSection } from '@/components/shared/LinkSection'

interface IssueSidebarProps {
  issue: IssueDetailBodyProps['issue']
  projectPath: string
  issueNumber: string
  stateManager: IssueDetailBodyProps['stateManager']
  stateOptions: IssueDetailBodyProps['stateOptions']
  statusChange: IssueDetailBodyProps['statusChange']
  editState: IssueDetailBodyProps['editState']
  onToggleDropdown: () => void
}

export function IssueSidebar({
  issue,
  projectPath,
  issueNumber,
  stateManager,
  stateOptions,
  statusChange,
  editState,
  onToggleDropdown,
}: IssueSidebarProps) {
  return (
    <>
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Properties</h3>
        <Metadata
          issue={issue}
          projectPath={projectPath}
          issueNumber={issueNumber}
          stateManager={stateManager}
          stateOptions={stateOptions}
          showStatusDropdown={statusChange.showStatusDropdown}
          updatingStatus={statusChange.updatingStatus}
          statusDropdownRef={statusChange.statusDropdownRef}
          assignees={editState.assignees}
          setAssignees={editState.setAssignees}
          onToggleDropdown={onToggleDropdown}
          onStatusChange={statusChange.handleStatusChange}
        />
      </div>
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Relations</h3>
        <LinkSection entityId={issue.id} entityType="issue" editable={true} />
      </div>
    </>
  )
}
