'use client'

import type { ReactElement } from 'react'
import { useIssueDetailPage } from './hooks/useIssueDetailPage'
import { renderLoadingState } from './IssueDetailLoading'
import { IssueDetailContent } from './IssueDetailContent'
import { Modals } from './Modals'
import type { IssueDetailProps } from './IssueDetail.types'

export function IssueDetail({
  issueNumber,
}: IssueDetailProps): ReactElement | null {
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
  const issue = state.detail.issue
  if (!issue) return null

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
        stateManager={state.stateManager}
        stateOptions={state.stateOptions}
        statusChange={state.statusChange}
        assets={state.detail.assets}
        setAssets={state.detail.setAssets}
        copyToClipboard={(text, label) =>
          void state.copyToClipboard(text, label)
        }
        onSave={state.onSave}
        onDelete={() => void state.actions.handleDelete()}
        onSoftDelete={() => void state.actions.handleSoftDelete()}
        onMove={() => void state.setShowMoveModal(true)}
        onDuplicate={() => void state.setShowDuplicateModal(true)}
        onShowDeleteConfirm={state.actions.setShowDeleteConfirm}
        onOpenInWorktree={state.editor.handleOpenInWorktree}
      />
      <Modals
        projectPath={state.projectPath}
        issue={issue}
        showMoveModal={state.showMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        onCloseMoveModal={() => void state.setShowMoveModal(false)}
        onCloseDuplicateModal={() => void state.setShowDuplicateModal(false)}
        onMoved={state.nav.handleMoved}
        onDuplicated={state.nav.handleDuplicated}
      />
    </>
  )
}
