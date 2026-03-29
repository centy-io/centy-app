'use client'

import type { ReactElement } from 'react'
import { EditForm } from './EditForm'
import { ViewContent } from './ViewContent'
import { Metadata } from './Metadata'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'

function buildToggleDropdown(
  setShowStatusDropdown: (show: boolean) => void,
  showStatusDropdown: boolean
): () => void {
  return () => setShowStatusDropdown(!showStatusDropdown)
}

function buildNumberBadgeHandler(
  copyToClipboard: IssueDetailBodyProps['copyToClipboard'],
  issueNumber: string,
  displayNumber: string
): () => void {
  return () => copyToClipboard(issueNumber, `issue #${displayNumber}`)
}

export function IssueDetailBody(props: IssueDetailBodyProps): ReactElement {
  const {
    issue,
    projectPath,
    issueNumber,
    editState,
    stateManager,
    stateOptions,
    statusChange,
    assets,
    setAssets,
    copyToClipboard,
  } = props
  const onToggleDropdown = buildToggleDropdown(
    statusChange.setShowStatusDropdown,
    statusChange.showStatusDropdown
  )
  const onBadgeClick = buildNumberBadgeHandler(
    copyToClipboard,
    issueNumber,
    issue.displayNumber
  )
  return (
    <div className="issue-content">
      <button
        type="button"
        className="issue-number-badge"
        onClick={onBadgeClick}
        title="Click to copy UUID"
      >
        #{issue.displayNumber}
      </button>
      {editState.isEditing ? (
        <EditForm
          projectPath={projectPath}
          issueNumber={issueNumber}
          editTitle={editState.editTitle}
          setEditTitle={editState.setEditTitle}
          editDescription={editState.editDescription}
          setEditDescription={editState.setEditDescription}
          editStatus={editState.editStatus}
          setEditStatus={editState.setEditStatus}
          editPriority={editState.editPriority}
          setEditPriority={editState.setEditPriority}
          stateOptions={stateOptions}
          assets={assets}
          setAssets={setAssets}
        />
      ) : (
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
      )}
    </div>
  )
}
