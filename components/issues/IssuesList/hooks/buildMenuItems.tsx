import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { buildContextMenuItems } from './buildContextMenuItems'
import type { Issue } from '@/gen/centy_pb'
import type { PinnedItem } from '@/hooks/usePinnedItems'

interface ContextMenuState {
  x: number
  y: number
  issue: Issue
}

interface PinActions {
  isPinned: (id: string) => boolean
  pinItem: (item: Omit<PinnedItem, 'pinnedAt'>) => void
  unpinItem: (id: string) => void
}

export function buildMenuItems(
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
