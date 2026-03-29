'use client'

import type { ReactElement } from 'react'
import { Metadata } from './Metadata'
import { ViewContent } from './ViewContent'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'

interface IssueDetailViewModeProps {
  issue: IssueDetailBodyProps['issue']
  projectPath: string
  issueNumber: string
  stateManager: IssueDetailBodyProps['stateManager']
  stateOptions: IssueDetailBodyProps['stateOptions']
  statusChange: IssueDetailBodyProps['statusChange']
  editState: IssueDetailBodyProps['editState']
  assets: IssueDetailBodyProps['assets']
  setAssets: IssueDetailBodyProps['setAssets']
  onToggleDropdown: () => void
}

export function IssueDetailViewMode({
  issue,
  projectPath,
  issueNumber,
  stateManager,
  stateOptions,
  statusChange,
  editState,
  assets,
  setAssets,
  onToggleDropdown,
}: IssueDetailViewModeProps): ReactElement {
  return (
    <>
      <h1 className="issue-title">{issue.title}</h1>
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
      <ViewContent
        issue={issue}
        projectPath={projectPath}
        issueNumber={issueNumber}
        assets={assets}
        setAssets={setAssets}
      />
    </>
  )
}
