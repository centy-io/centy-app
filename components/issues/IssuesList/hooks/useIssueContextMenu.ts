import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { buildContextMenuItems } from './buildContextMenuItems'
import { useIssueMoveActions } from './useIssueMoveActions'
import type { Issue } from '@/gen/centy_pb'
import { usePinnedItems, type PinnedItem } from '@/hooks/usePinnedItems'

interface PinActions {
  isPinned: (id: string) => boolean
  pinItem: (item: Omit<PinnedItem, 'pinnedAt'>) => void
  unpinItem: (id: string) => void
}

interface ContextMenuState {
  x: number
  y: number
  issue: Issue
}

function buildMenuItems(
  contextMenu: ContextMenuState | null,
  pinActions: PinActions,
  createLink: (path: string) => RouteLiteral,
  router: ReturnType<typeof useRouter>,
  setContextMenu: (v: ContextMenuState | null) => void,
  setSelectedIssue: (v: Issue | null) => void,
  setShowMoveModal: (v: boolean) => void,
  setShowDuplicateModal: (v: boolean) => void
) {
  if (!contextMenu) return []
  return buildContextMenuItems({
    issue: contextMenu.issue,
    pinActions,
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
    onClose: () => setContextMenu(null),
  })
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
