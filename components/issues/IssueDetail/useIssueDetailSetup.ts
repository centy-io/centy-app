import { useState, useCallback } from 'react'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { useStateManager } from '@/lib/state'
import { useIssueDetail } from './hooks/useIssueDetail'
import { useIssueActions } from './hooks/useIssueActions'
import { useStatusChange } from './hooks/useStatusChange'
import { useIssueNavigation } from './hooks/useIssueNavigation'
import { useEditorActions } from './hooks/useEditorActions'
import { useEditState } from './hooks/useEditState'

export function useIssueDetailSetup(issueNumber: string) {
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

  return {
    projectPath,
    pathLoading,
    stateOptions,
    data,
    nav,
    actions,
    statusCtrl,
    editor,
    edit,
    assignees,
    setAssignees,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    showStatusConfig,
    setShowStatusConfig,
    onStatusConfigured,
  }
}
