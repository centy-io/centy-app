'use client'

import type { ReactElement } from 'react'
import { EditForm } from './EditForm'
import { IssueDetailViewMode } from './IssueDetailViewMode'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'
import { ItemContent } from '@/components/shared/ItemView'

function buildToggleDropdown(
  setShowStatusDropdown: (show: boolean) => void,
  showStatusDropdown: boolean
): () => void {
  return () => {
    setShowStatusDropdown(!showStatusDropdown)
  }
}

function buildNumberBadgeHandler(
  copyToClipboard: IssueDetailBodyProps['copyToClipboard'],
  issueNumber: string,
  displayNumber: number
): () => void {
  return () => {
    copyToClipboard(issueNumber, `issue #${displayNumber}`)
  }
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
    issue.metadata ? issue.metadata.displayNumber : 0
  )
  return (
    <ItemContent>
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
        <IssueDetailViewMode
          issue={issue}
          projectPath={projectPath}
          issueNumber={issueNumber}
          stateManager={stateManager}
          stateOptions={stateOptions}
          statusChange={statusChange}
          editState={editState}
          assets={assets}
          setAssets={setAssets}
          onToggleDropdown={onToggleDropdown}
          onBadgeClick={onBadgeClick}
        />
      )}
    </ItemContent>
  )
}
