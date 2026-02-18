'use client'

import type { ReactElement } from 'react'
import { useIssueDetailPage } from './hooks/useIssueDetailPage'
import { renderLoadingState } from './IssueDetailLoading'
import { IssueDetailContent } from './IssueDetailContent'
import { Modals } from './Modals'
import type { IssueDetailProps } from './IssueDetail.types'

export function IssueDetail({ issueNumber }: IssueDetailProps): ReactElement {
  const state = useIssueDetailPage(issueNumber)

  const loadingView = renderLoadingState({
    projectPath: state.projectPath,
    pathLoading: state.pathLoading,
    loading: state.detail.loading,
    error: state.detail.error,
    issue: state.detail.issue,
    issuesListUrl: state.nav.issuesListUrl,
  })

  if (loadingView) return loadingView
  // After this point, issue is guaranteed to be non-null
  const issue = state.detail.issue!

  return (
    <>
      <IssueDetailContent
        issue={issue}
        projectPath={state.projectPath}
        issueNumber={issueNumber}
        error={state.detail.error}
        issuesListUrl={state.nav.issuesListUrl}
        editState={state.editState}
        saving={state.actions.saving}
        deleting={state.actions.deleting}
        showDeleteConfirm={state.actions.showDeleteConfirm}
        openingInVscode={state.editor.openingInVscode}
        stateManager={state.stateManager}
        stateOptions={state.stateOptions}
        statusChange={state.statusChange}
        assets={state.detail.assets}
        setAssets={state.detail.setAssets}
        copyToClipboard={state.copyToClipboard}
        onSave={state.onSave}
        onDelete={state.actions.handleDelete}
        onMove={() => state.setShowMoveModal(true)}
        onDuplicate={() => state.setShowDuplicateModal(true)}
        onShowDeleteConfirm={state.actions.setShowDeleteConfirm}
        onOpenInVscode={state.editor.handleOpenInVscode}
        onOpenInTerminal={state.editor.handleOpenInTerminal}
      />
      <Modals
        projectPath={state.projectPath}
        issue={issue}
        showMoveModal={state.showMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        showStatusConfigDialog={state.showStatusConfigDialog}
        onCloseMoveModal={() => state.setShowMoveModal(false)}
        onCloseDuplicateModal={() => state.setShowDuplicateModal(false)}
        onCloseStatusConfigDialog={() => state.setShowStatusConfigDialog(false)}
        onMoved={state.nav.handleMoved}
        onDuplicated={state.nav.handleDuplicated}
        onStatusConfigured={state.handleStatusConfigured}
      />
    </>
  )
}
