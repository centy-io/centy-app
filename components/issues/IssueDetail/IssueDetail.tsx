'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { IssueDetailHeader } from './IssueDetailHeader'
import { DeleteConfirmation } from './DeleteConfirmation'
import { IssueContentSection } from './IssueContentSection'
import { IssueDetailModals } from './IssueDetailModals'
import { getLoadingState } from './IssueDetailLoadingStates'
import { useIssueDetailSetup } from './useIssueDetailSetup'
import type { IssueDetailProps } from './IssueDetail.types'

export function IssueDetail({ issueNumber }: IssueDetailProps) {
  const s = useIssueDetailSetup(issueNumber)

  const ls = getLoadingState({
    projectPath: s.projectPath,
    pathLoading: s.pathLoading,
    loading: s.data.loading,
    error: s.data.error,
    hasIssue: !!s.data.issue,
    issuesListUrl: s.nav.issuesListUrl,
  })
  if (ls.element) return ls.element
  const issue = s.data.issue!

  return (
    <div className="issue-detail">
      <IssueDetailHeader
        issuesListUrl={s.nav.issuesListUrl}
        isEditing={s.edit.isEditing}
        saving={s.actions.saving}
        openingInVscode={s.editor.openingInVscode}
        editTitle={s.edit.editTitle}
        onEdit={s.edit.handleStartEdit}
        onCancelEdit={s.edit.handleCancelEdit}
        onSave={s.edit.handleSave}
        onOpenInVscode={s.editor.handleOpenInVscode}
        onOpenInTerminal={s.editor.handleOpenInTerminal}
        onMove={() => s.setShowMoveModal(true)}
        onDuplicate={() => s.setShowDuplicateModal(true)}
        onDelete={() => s.actions.setShowDeleteConfirm(true)}
      />
      {s.data.error && <DaemonErrorMessage error={s.data.error} />}
      {s.actions.showDeleteConfirm && (
        <DeleteConfirmation
          deleting={s.actions.deleting}
          onCancel={() => s.actions.setShowDeleteConfirm(false)}
          onConfirm={s.actions.handleDelete}
        />
      )}
      <IssueContentSection
        issue={issue}
        issueNumber={issueNumber}
        projectPath={s.projectPath}
        isEditing={s.edit.isEditing}
        editTitle={s.edit.editTitle}
        editDescription={s.edit.editDescription}
        editStatus={s.edit.editStatus}
        editPriority={s.edit.editPriority}
        stateOptions={s.stateOptions}
        assets={s.data.assets}
        updatingStatus={s.statusCtrl.updatingStatus}
        showStatusDropdown={s.statusCtrl.showStatusDropdown}
        assignees={s.assignees}
        onTitleChange={s.edit.setEditTitle}
        onDescriptionChange={s.edit.setEditDescription}
        onStatusChange={s.edit.setEditStatus}
        onPriorityChange={s.edit.setEditPriority}
        onAssetsChange={s.data.setAssets}
        onStatusDropdownToggle={() =>
          s.statusCtrl.setShowStatusDropdown(!s.statusCtrl.showStatusDropdown)
        }
        onViewStatusChange={s.statusCtrl.handleStatusChange}
        onAssigneesChange={s.setAssignees}
      />
      <IssueDetailModals
        issue={issue}
        projectPath={s.projectPath}
        showMoveModal={s.showMoveModal}
        showDuplicateModal={s.showDuplicateModal}
        showStatusConfigDialog={s.showStatusConfig}
        onCloseMoveModal={() => s.setShowMoveModal(false)}
        onCloseDuplicateModal={() => s.setShowDuplicateModal(false)}
        onCloseStatusConfigDialog={() => s.setShowStatusConfig(false)}
        onMoved={s.nav.handleMoved}
        onDuplicated={s.nav.handleDuplicated}
        onStatusConfigured={s.onStatusConfigured}
      />
    </div>
  )
}
