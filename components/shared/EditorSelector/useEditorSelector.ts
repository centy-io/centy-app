import { useCallback } from 'react'
import { EditorType } from '@/gen/centy_pb'
import { useEditorPreference } from './useEditorPreference'

export function useEditorSelector(
  onOpenInVscode: () => Promise<void>,
  onOpenInTerminal: () => Promise<void>,
  disabled: boolean,
  loading: boolean
) {
  const preference = useEditorPreference()
  const {
    preferredEditor,
    preferredEditorAvailable,
    isEditorAvailable,
    savePreference,
    setShowDropdown,
  } = preference

  const handlePrimaryClick = useCallback(async () => {
    if (disabled || loading || !preferredEditorAvailable) return
    if (preferredEditor === EditorType.VSCODE) {
      await onOpenInVscode()
    } else if (preferredEditor === EditorType.TERMINAL) {
      await onOpenInTerminal()
    }
  }, [
    disabled,
    loading,
    preferredEditor,
    preferredEditorAvailable,
    onOpenInVscode,
    onOpenInTerminal,
  ])

  const handleSelectEditor = useCallback(
    async (editorType: EditorType) => {
      if (disabled || loading) return
      if (!isEditorAvailable(editorType)) return
      savePreference(editorType)
      setShowDropdown(false)
      if (editorType === EditorType.VSCODE) {
        await onOpenInVscode()
      } else if (editorType === EditorType.TERMINAL) {
        await onOpenInTerminal()
      }
    },
    [
      disabled,
      loading,
      isEditorAvailable,
      savePreference,
      setShowDropdown,
      onOpenInVscode,
      onOpenInTerminal,
    ]
  )

  return {
    ...preference,
    handlePrimaryClick,
    handleSelectEditor,
  }
}
