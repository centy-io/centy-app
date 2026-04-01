export interface ContextMenuItem {
  label: string
  icon?: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}
