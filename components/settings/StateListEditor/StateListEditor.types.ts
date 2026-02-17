export interface StateListEditorProps {
  states: string[]
  stateColors: Record<string, string>
  defaultState: string
  onStatesChange: (states: string[]) => void
  onColorsChange: (colors: Record<string, string>) => void
  onDefaultChange: (defaultState: string) => void
}

export interface StateRowProps {
  state: string
  index: number
  color: string
  isDragging: boolean
  isDefault: boolean
  canRemove: boolean
  onColorChange: (color: string) => void
  onSetDefault: () => void
  onRemove: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
}

export interface AddStateFormProps {
  states: string[]
  onAddState: (state: string) => void
}
