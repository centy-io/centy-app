'use client'

import type { ReactElement } from 'react'
import { EditForm } from './EditForm'
import { IssueViewSection } from './IssueViewSection'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'

export function IssueDetailBody({
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
}: IssueDetailBodyProps): ReactElement {
  return (
    <div className="issue-content">
      <button
        type="button"
        className="issue-number-badge"
        onClick={() =>
          copyToClipboard(issueNumber, `issue #${issue.displayNumber}`)
        }
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
        <IssueViewSection
          issue={issue}
          projectPath={projectPath}
          issueNumber={issueNumber}
          editState={editState}
          stateManager={stateManager}
          stateOptions={stateOptions}
          statusChange={statusChange}
          assets={assets}
          setAssets={setAssets}
        />
      )}
    </div>
  )
}
