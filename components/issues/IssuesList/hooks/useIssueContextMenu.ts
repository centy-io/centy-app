import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { buildContextMenuItems } from './buildContextMenuItems'
import { useIssueMoveActions } from './useIssueMoveActions'
import type { GenericItem } from '@/gen/centy_pb'
import { usePinnedItems } from '@/hooks/usePinnedItems'

interface ContextMenuState {
  x: number
  y: number
  issue: GenericItem
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
  const [selectedIssue, setSelectedIssue] = useState<GenericItem | null>(null)

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, issue: GenericItem) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, issue })
    },
    []
  )

  const onDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      await handleDuplicated(newIssueId, targetProjectPath, () => {
        setShowDuplicateModal(false)
        setSelectedIssue(null)
      })
    },
    [handleDuplicated]
  )

  const contextMenuItems = contextMenu
    ? buildContextMenuItems({
        issue: contextMenu.issue,
        pinActions: { isPinned, pinItem, unpinItem },
        onView: () => {
          router.push(createLink(`/issues/${contextMenu.issue.id}`))
          setContextMenu(null)
        },
        onMove: () => {
          setSelectedIssue(contextMenu.issue)
          setShowMoveModal(true)
          setContextMenu(null)
        },
        onDuplicate: () => {
          setSelectedIssue(contextMenu.issue)
          setShowDuplicateModal(true)
          setContextMenu(null)
        },
        onClose: () => void setContextMenu(null),
      })
    : []

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
