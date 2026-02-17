'use client'

import { useState, useCallback } from 'react'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { useStateManager } from '@/lib/state'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useIssueDetail } from './hooks/useIssueDetail'
import { useIssueActions } from './hooks/useIssueActions'
import { useStatusChange } from './hooks/useStatusChange'
import { useIssueNavigation } from './hooks/useIssueNavigation'
import { useEditorActions } from './hooks/useEditorActions'
import { useEditState } from './hooks/useEditState'
import { IssueDetailHeader } from './IssueDetailHeader'
import { DeleteConfirmation } from './DeleteConfirmation'
import { IssueContentSection } from './IssueContentSection'
import { IssueDetailModals } from './IssueDetailModals'
import { getLoadingState } from './IssueDetailLoadingStates'
import type { IssueDetailProps } from './IssueDetail.types'

export function IssueDetail({ issueNumber }: IssueDetailProps) {
  const { projectPath, isLoading: pathLoading } = usePathContext()
  useDaemonStatus()
  const stateOptions = useStateManager().getStateOptions()
  const data = useIssueDetail(projectPath, issueNumber)
  const nav = useIssueNavigation(projectPath)
  const actions = useIssueActions({
    projectPath,
    issueNumber,
    issue: data.issue,
    setIssue: data.setIssue,
    setError: data.setError,
    onDeleted: nav.navigateToIssuesList,
  })
  const statusCtrl = useStatusChange({
    projectPath,
    issueNumber,
    issue: data.issue,
    setIssue: data.setIssue,
    setError: data.setError,
  })
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showStatusConfig, setShowStatusConfig] = useState(false)
  const [assignees, setAssignees] = useState<string[]>([])
  const editor = useEditorActions({
    projectPath,
    issue: data.issue,
    setError: data.setError,
    setShowStatusConfigDialog: setShowStatusConfig,
  })
  const edit = useEditState({
    issue: data.issue,
    onSave: actions.handleSave,
    saving: actions.saving,
  })
  const onStatusConfigured = useCallback(() => {
    setShowStatusConfig(false)
    editor.handleOpenInVscode()
  }, [editor.handleOpenInVscode])

  const ls = getLoadingState({
    projectPath,
    pathLoading,
    loading: data.loading,
    error: data.error,
    hasIssue: !!data.issue,
    issuesListUrl: nav.issuesListUrl,
  })
  if (ls.element) return ls.element
  const issue = data.issue!

  return (
    <div className="issue-detail">
      <IssueDetailHeader
        issuesListUrl={nav.issuesListUrl}
        isEditing={edit.isEditing}
        saving={actions.saving}
        openingInVscode={editor.openingInVscode}
        editTitle={edit.editTitle}
        onEdit={edit.handleStartEdit}
        onCancelEdit={edit.handleCancelEdit}
        onSave={edit.handleSave}
        onOpenInVscode={editor.handleOpenInVscode}
        onOpenInTerminal={editor.handleOpenInTerminal}
        onMove={() => setShowMoveModal(true)}
        onDuplicate={() => setShowDuplicateModal(true)}
        onDelete={() => actions.setShowDeleteConfirm(true)}
      />
      {data.error && <DaemonErrorMessage error={data.error} />}
      {actions.showDeleteConfirm && (
        <DeleteConfirmation
          deleting={actions.deleting}
          onCancel={() => actions.setShowDeleteConfirm(false)}
          onConfirm={actions.handleDelete}
        />
      )}
      <IssueContentSection
        issue={issue}
        issueNumber={issueNumber}
        projectPath={projectPath}
        isEditing={edit.isEditing}
        editTitle={edit.editTitle}
        editDescription={edit.editDescription}
        editStatus={edit.editStatus}
        editPriority={edit.editPriority}
        stateOptions={stateOptions}
        assets={data.assets}
        updatingStatus={statusCtrl.updatingStatus}
        showStatusDropdown={statusCtrl.showStatusDropdown}
        assignees={assignees}
        onTitleChange={edit.setEditTitle}
        onDescriptionChange={edit.setEditDescription}
        onStatusChange={edit.setEditStatus}
        onPriorityChange={edit.setEditPriority}
        onAssetsChange={data.setAssets}
        onStatusDropdownToggle={() =>
          statusCtrl.setShowStatusDropdown(!statusCtrl.showStatusDropdown)
        }
        onViewStatusChange={statusCtrl.handleStatusChange}
        onAssigneesChange={setAssignees}
      />
      <IssueDetailModals
        issue={issue}
        projectPath={projectPath}
        showMoveModal={showMoveModal}
        showDuplicateModal={showDuplicateModal}
        showStatusConfigDialog={showStatusConfig}
        onCloseMoveModal={() => setShowMoveModal(false)}
        onCloseDuplicateModal={() => setShowDuplicateModal(false)}
        onCloseStatusConfigDialog={() => setShowStatusConfig(false)}
        onMoved={nav.handleMoved}
        onDuplicated={nav.handleDuplicated}
        onStatusConfigured={onStatusConfigured}
      />
    </div>
  )
}
