import type { Issue } from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { PinnedItem } from '@/hooks/usePinnedItems'

interface PinActions {
  isPinned: (id: string) => boolean
  pinItem: (item: Omit<PinnedItem, 'pinnedAt'>) => void
  unpinItem: (id: string) => void
}

interface BuildMenuParams {
  issue: Issue
  pinActions: PinActions
  onView: () => void
  onMove: () => void
  onDuplicate: () => void
  onClose: () => void
}

export function buildContextMenuItems({
  issue,
  pinActions,
  onView,
  onMove,
  onDuplicate,
  onClose,
}: BuildMenuParams): ContextMenuItem[] {
  return [
    {
      label: pinActions.isPinned(issue.issueNumber) ? 'Unpin' : 'Pin',
      onClick: () => {
        if (pinActions.isPinned(issue.issueNumber)) {
          pinActions.unpinItem(issue.issueNumber)
        } else {
          pinActions.pinItem({
            id: issue.issueNumber,
            type: 'issue',
            title: issue.title,
            displayNumber: issue.displayNumber,
          })
        }
        onClose()
      },
    },
    {
      label: 'View',
      onClick: onView,
    },
    {
      label: 'Move',
      onClick: onMove,
    },
    {
      label: 'Duplicate',
      onClick: onDuplicate,
    },
  ]
}
