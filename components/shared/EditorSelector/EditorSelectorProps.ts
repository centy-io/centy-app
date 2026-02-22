export interface EditorSelectorProps {
  onOpenInVscode: () => Promise<void>
  onOpenInTerminal: () => Promise<void>
  disabled?: boolean
  loading?: boolean
}
