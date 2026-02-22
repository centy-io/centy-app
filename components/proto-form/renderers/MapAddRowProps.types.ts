export interface MapAddRowProps {
  newKey: string
  newValue: string
  isKeyTaken: boolean
  onKeyChange: (v: string) => void
  onValueChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}
