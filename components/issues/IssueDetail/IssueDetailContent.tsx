'use client'

import type { ReactElement, RefObject } from 'react'
import type { RouteLiteral } from 'nextjs-routes'
import type { Issue, Asset } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { Header } from './Header'
import { DeleteConfirmation } from './DeleteConfirmation'
import { IssueDetailBody } from './IssueDetailBody'

interface IssueDetailContentProps {
  issue: Issue
  projectPath: string
  issueNumber: string
  error: string | null
  issuesListUrl: RouteLiteral
  editState: {
    isEditing: boolean
    setIsEditing: (v: boolean) => void
    editTitle: string
    setEditTitle: (v: string) => void
    editDescription: string
    setEditDescription: (v: string) => void
    editStatus: string
    setEditStatus: (v: string) => void
    editPriority: number
    setEditPriority: (v: number) => void
    handleCancelEdit: () => void
    assignees: string[]
    setAssignees: (v: string[]) => void
  }
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  openingInVscode: boolean
  stateManager: { getStateClass: (status: string) => string }
  stateOptions: { value: string; label: string }[]
  statusChange: {
    showStatusDropdown: boolean
    setShowStatusDropdown: (v: boolean) => void
    updatingStatus: boolean
    statusDropdownRef: RefObject<HTMLDivElement | null>
    handleStatusChange: (status: string) => void
  }
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
  copyToClipboard: (text: string, label: string) => void
  onSave: () => void
  onDelete: () => void
  onMove: () => void
  onDuplicate: () => void
  onShowDeleteConfirm: (v: boolean) => void
  onOpenInVscode: () => Promise<void>
  onOpenInTerminal: () => Promise<void>
}

export function IssueDetailContent(
  props: IssueDetailContentProps
): ReactElement {
  const { editState, error, showDeleteConfirm } = props
  return (
    <div className="issue-detail">
      <Header
        issuesListUrl={props.issuesListUrl}
        isEditing={editState.isEditing}
        saving={props.saving}
        openingInVscode={props.openingInVscode}
        onEdit={() => editState.setIsEditing(true)}
        onCancelEdit={editState.handleCancelEdit}
        onSave={props.onSave}
        onMove={props.onMove}
        onDuplicate={props.onDuplicate}
        onDelete={() => props.onShowDeleteConfirm(true)}
        onOpenInVscode={props.onOpenInVscode}
        onOpenInTerminal={props.onOpenInTerminal}
      />
      {error && <DaemonErrorMessage error={error} />}
      {showDeleteConfirm && (
        <DeleteConfirmation
          deleting={props.deleting}
          onCancel={() => props.onShowDeleteConfirm(false)}
          onConfirm={props.onDelete}
        />
      )}
      <IssueDetailBody
        issue={props.issue}
        projectPath={props.projectPath}
        issueNumber={props.issueNumber}
        editState={editState}
        stateManager={props.stateManager}
        stateOptions={props.stateOptions}
        statusChange={props.statusChange}
        assets={props.assets}
        setAssets={props.setAssets}
        copyToClipboard={props.copyToClipboard}
      />
    </div>
  )
}
