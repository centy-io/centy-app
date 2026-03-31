import { useCallback } from 'react'
import { useEditorPreference } from './useEditorPreference'

export function useEditorSelector(
  onOpenInVscode: () => Promise<void>,
  onOpenInTerminal: () => Promise<void>,
  disabled: boolean,
  loading: boolean
) {
  const pref = useEditorPreference()

  const handlePrimaryClick = useCallback(async () => {
    if (disabled || loading || !pref.preferredEditorAvailable) return
    if (pref.preferredEditor === 'vscode') {
      await onOpenInVscode()
    } else if (pref.preferredEditor === 'terminal') {
      await onOpenInTerminal()
    }
  }, [
    disabled,
    loading,
    pref.preferredEditor,
    pref.preferredEditorAvailable,
    onOpenInVscode,
    onOpenInTerminal,
  ])

  const handleSelectEditor = useCallback(
    async (editorId: string) => {
      if (disabled || loading) return
      const available = pref.isEditorAvailable(editorId)
      if (!available) return
      pref.savePreference(editorId)
      pref.setShowDropdown(false)
      if (editorId === 'vscode') {
        await onOpenInVscode()
      } else if (editorId === 'terminal') {
        await onOpenInTerminal()
      }
    },
    [disabled, loading, pref, onOpenInVscode, onOpenInTerminal]
  )

  return {
    ...pref,
    handlePrimaryClick,
    handleSelectEditor,
  }
}
