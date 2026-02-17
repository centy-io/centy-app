import { useCallback } from 'react'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { Issue } from '@/gen/centy_pb'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { ContextMenuState } from '../IssuesList.types'

interface UseContextMenuItemsArgs {
  contextMenu: ContextMenuState | null
  setContextMenu: (v: ContextMenuState | null) => void
  router: AppRouterInstance
  createLink: (path: string) => string
  handleMoveIssue: (issue: Issue) => void
  handleDuplicateIssue: (issue: Issue) => void
}

export function useContextMenuItems({
  contextMenu,
  setContextMenu,
  router,
  createLink,
  handleMoveIssue,
  handleDuplicateIssue,
}: UseContextMenuItemsArgs) {
  const { pinItem, unpinItem, isPinned } = usePinnedItems()

  const getContextMenuItems = useCallback((): ContextMenuItem[] => {
    if (!contextMenu) return []
    const issue = contextMenu.issue
    return [
      {
        label: isPinned(issue.issueNumber) ? 'Unpin' : 'Pin',
        onClick: () => {
          if (isPinned(issue.issueNumber)) {
            unpinItem(issue.issueNumber)
          } else {
            pinItem({
              id: issue.issueNumber,
              type: 'issue',
              title: issue.title,
              displayNumber: issue.displayNumber,
            })
          }
          setContextMenu(null)
        },
      },
      {
        label: 'View',
        onClick: () => {
          router.push(createLink(`/issues/${issue.id}`))
          setContextMenu(null)
        },
      },
      { label: 'Move', onClick: () => handleMoveIssue(issue) },
      { label: 'Duplicate', onClick: () => handleDuplicateIssue(issue) },
    ]
  }, [
    contextMenu,
    isPinned,
    unpinItem,
    pinItem,
    setContextMenu,
    router,
    createLink,
    handleMoveIssue,
    handleDuplicateIssue,
  ])

  return getContextMenuItems
}
