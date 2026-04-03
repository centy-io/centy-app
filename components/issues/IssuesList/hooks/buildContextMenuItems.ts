import type { GenericItem } from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenuItem'
import type { PinnedItem } from '@/hooks/usePinnedItems'

interface PinActions {
  isPinned: (id: string) => boolean
  pinItem: (item: Omit<PinnedItem, 'pinnedAt'>) => void
  unpinItem: (id: string) => void
}

interface BuildMenuParams {
  issue: GenericItem
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
      label: pinActions.isPinned(issue.id) ? 'Unpin' : 'Pin',
      onClick: () => {
        if (pinActions.isPinned(issue.id)) {
          pinActions.unpinItem(issue.id)
        } else {
          pinActions.pinItem({
            id: issue.id,
            type: 'issue',
            title: issue.title,
            displayNumber: issue.metadata ? issue.metadata.displayNumber : 0,
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
