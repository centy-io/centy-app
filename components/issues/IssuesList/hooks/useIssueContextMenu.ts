import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { buildMenuItems } from './buildMenuItems'
import { useIssueMoveActions } from './useIssueMoveActions'
import type { Issue } from '@/gen/centy_pb'
import { usePinnedItems } from '@/hooks/usePinnedItems'

interface ContextMenuState {
  x: number
  y: number
  issue: Issue
}

export function useIssueContextMenu(
  projectPath: string,
  fetchIssues: () => void
) {
  const router = useRouter()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()
  const { createLink, handleMoved, handleDuplicated } = useIssueMoveActions(
    projectPath,
    fetchIssues
  )

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showStandaloneModal, setShowStandaloneModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, issue: Issue) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, issue })
  }, [])

  const onDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      await handleDuplicated(newIssueId, targetProjectPath, () => {
        setShowDuplicateModal(false)
        setSelectedIssue(null)
      })
    },
    [handleDuplicated]
  )

  const contextMenuItems = buildMenuItems(
    contextMenu,
    { isPinned, pinItem, unpinItem },
    createLink,
    router,
    setContextMenu,
    setSelectedIssue,
    setShowMoveModal,
    setShowDuplicateModal
  )

  return {
    contextMenu,
    setContextMenu,
    contextMenuItems,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    showStandaloneModal,
    setShowStandaloneModal,
    selectedIssue,
    setSelectedIssue,
    handleContextMenu,
    handleMoved,
    handleDuplicated: onDuplicated,
    createLink,
  }
}
