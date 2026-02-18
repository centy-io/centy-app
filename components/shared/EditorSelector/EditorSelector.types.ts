export const EDITOR_PREFERENCE_KEY = 'centy-preferred-editor'

export interface EditorSelectorProps {
  onOpenInVscode: () => Promise<void>
  onOpenInTerminal: () => Promise<void>
  disabled?: boolean
  loading?: boolean
}
