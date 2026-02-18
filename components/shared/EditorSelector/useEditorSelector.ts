import { useCallback } from 'react'
import { useEditorPreference } from './useEditorPreference'
import { EditorType } from '@/gen/centy_pb'

export function useEditorSelector(
  onOpenInVscode: () => Promise<void>,
  onOpenInTerminal: () => Promise<void>,
  disabled: boolean,
  loading: boolean
) {
  const pref = useEditorPreference()

  const handlePrimaryClick = useCallback(async () => {
    if (disabled || loading || !pref.preferredEditorAvailable) return
    if (pref.preferredEditor === EditorType.VSCODE) {
      await onOpenInVscode()
    } else if (pref.preferredEditor === EditorType.TERMINAL) {
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
    async (editorType: EditorType) => {
      if (disabled || loading) return
      const available = pref.isEditorAvailable(editorType)
      if (!available) return
      pref.savePreference(editorType)
      pref.setShowDropdown(false)
      if (editorType === EditorType.VSCODE) {
        await onOpenInVscode()
      } else if (editorType === EditorType.TERMINAL) {
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
