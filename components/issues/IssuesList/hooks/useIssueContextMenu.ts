import { useState, useCallback } from 'react'
import type { Issue } from '@/gen/centy_pb'
import type { ContextMenuState } from '../IssuesList.types'
import { useContextMenuNavigation } from './useContextMenuNavigation'
import { useContextMenuItems } from './useContextMenuItems'

export function useIssueContextMenu(
  projectPath: string,
  fetchIssues: () => Promise<void>
) {
  const { router, createLink, handleMoved, handleDuplicated } =
    useContextMenuNavigation(projectPath, fetchIssues)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, issue: Issue) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, issue })
  }, [])

  const handleMoveIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue)
    setShowMoveModal(true)
    setContextMenu(null)
  }, [])

  const handleDuplicateIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue)
    setShowDuplicateModal(true)
    setContextMenu(null)
  }, [])

  const onDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      await handleDuplicated(newIssueId, targetProjectPath)
      setShowDuplicateModal(false)
      setSelectedIssue(null)
    },
    [handleDuplicated]
  )

  const getContextMenuItems = useContextMenuItems({
    contextMenu,
    setContextMenu,
    router,
    createLink,
    handleMoveIssue,
    handleDuplicateIssue,
  })

  const closeMoveModal = useCallback(() => {
    setShowMoveModal(false)
    setSelectedIssue(null)
  }, [])

  const closeDuplicateModal = useCallback(() => {
    setShowDuplicateModal(false)
    setSelectedIssue(null)
  }, [])

  return {
    contextMenu,
    setContextMenu,
    showMoveModal,
    showDuplicateModal,
    selectedIssue,
    handleContextMenu,
    handleMoved,
    handleDuplicated: onDuplicated,
    getContextMenuItems,
    closeMoveModal,
    closeDuplicateModal,
  }
}
