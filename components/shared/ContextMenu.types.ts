import type { ContextMenuItem } from './ContextMenuItem'

export interface ContextMenuProps {
  items: ContextMenuItem[]
  x: number
  y: number
  onClose: () => void
}
