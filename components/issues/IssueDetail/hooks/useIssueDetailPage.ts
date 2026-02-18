import { useState, useCallback } from 'react'
import { useIssueDetail } from './useIssueDetail'
import { useEditState } from './useEditState'
import { useIssueActions } from './useIssueActions'
import { useEditorActions } from './useEditorActions'
import { useStatusChange } from './useStatusChange'
import { useIssueNavigation } from './useIssueNavigation'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { useStateManager } from '@/lib/state'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function useIssueDetailPage(issueNumber: string) {
  const { projectPath, isLoading: pathLoading } = usePathContext()
  useDaemonStatus()
  const { copyToClipboard } = useCopyToClipboard()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()

  const detail = useIssueDetail(projectPath, issueNumber)
  const editState = useEditState(detail.issue)
  const nav = useIssueNavigation(projectPath)
  const actions = useIssueActions({
    projectPath,
    issueNumber,
    issuesListUrl: nav.issuesListUrl,
    setIssue: detail.setIssue,
    setError: detail.setError,
  })

  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showStatusConfigDialog, setShowStatusConfigDialog] = useState(false)

  const editor = useEditorActions(
    projectPath,
    detail.issue,
    detail.setError,
    setShowStatusConfigDialog
  )
  const statusChange = useStatusChange(
    projectPath,
    issueNumber,
    detail.issue,
    detail.setIssue,
    detail.setError,
    editState.setEditStatus
  )

  const onSave = useCallback(() => {
    void actions.handleSave(editState)
  }, [actions, editState])

  useSaveShortcut({
    onSave,
    enabled:
      editState.isEditing && !actions.saving && !!editState.editTitle.trim(),
  })

  const handleStatusConfigured = useCallback(() => {
    setShowStatusConfigDialog(false)
    editor.handleOpenInVscode()
  }, [editor])

  return {
    projectPath,
    pathLoading,
    copyToClipboard,
    stateManager,
    stateOptions,
    detail,
    editState,
    nav,
    actions,
    editor,
    statusChange,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    showStatusConfigDialog,
    setShowStatusConfigDialog,
    onSave,
    handleStatusConfigured,
  }
}
