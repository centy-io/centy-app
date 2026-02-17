export interface DefaultsEditorProps {
  value: Record<string, string>
  onChange: (defaults: Record<string, string>) => void
  suggestedKeys?: string[]
}

export interface DefaultsTableProps {
  entries: [string, string][]
  onValueChange: (key: string, newVal: string) => void
  onRemove: (key: string) => void
}

export interface DefaultsAddRowProps {
  newKey: string
  newValue: string
  availableKeys: string[]
  value: Record<string, string>
  onNewKeyChange: (key: string) => void
  onNewValueChange: (val: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onAdd: () => void
}
