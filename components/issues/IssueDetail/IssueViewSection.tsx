'use client'

import type { ReactElement } from 'react'
import { ViewContent } from './ViewContent'
import { Metadata } from './Metadata'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'

export function IssueViewSection({
  issue,
  projectPath,
  issueNumber,
  editState,
  stateManager,
  stateOptions,
  statusChange,
  assets,
  setAssets,
}: Omit<IssueDetailBodyProps, 'copyToClipboard'>): ReactElement {
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
        onToggleDropdown={() =>
          statusChange.setShowStatusDropdown(!statusChange.showStatusDropdown)
        }
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
