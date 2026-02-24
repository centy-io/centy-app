import { useState, useCallback, useEffect, useRef } from 'react'
import { EDITOR_PREFERENCE_KEY } from './EditorSelector.types'
import { EditorType, type EditorInfo } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

function useDropdownDismiss(
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  showDropdown: boolean,
  setShowDropdown: (v: boolean) => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef, showDropdown, setShowDropdown])
}

function usePersistedEditorType() {
  const [preferredEditor, setPreferredEditor] = useState<EditorType>(
    EditorType.VSCODE
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const saved = localStorage.getItem(EDITOR_PREFERENCE_KEY)
      if (!saved) return
      const parsedValue = parseInt(saved, 10)
      if (parsedValue === EditorType.VSCODE) {
        setPreferredEditor(EditorType.VSCODE)
      } else if (parsedValue === EditorType.TERMINAL) {
        setPreferredEditor(EditorType.TERMINAL)
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const savePreference = useCallback((editorType: EditorType) => {
    setPreferredEditor(editorType)
    localStorage.setItem(EDITOR_PREFERENCE_KEY, String(editorType))
  }, [])

  return { preferredEditor, savePreference }
}

export function useEditorPreference() {
  const { editors } = useDaemonStatus()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { preferredEditor, savePreference } = usePersistedEditorType()

  useDropdownDismiss(dropdownRef, showDropdown, setShowDropdown)

  const getEditorInfo = useCallback(
    (type: EditorType): EditorInfo | undefined => {
      return editors.find(e => e.editorType === type)
    },
    [editors]
  )

  const isEditorAvailable = useCallback(
    (type: EditorType): boolean => {
      const editor = getEditorInfo(type)
      return editor !== undefined ? editor.available : false
    },
    [getEditorInfo]
  )

  const preferredEditorInfo = getEditorInfo(preferredEditor)
  const preferredEditorName =
    (preferredEditorInfo ? preferredEditorInfo.name : '') || 'VS Code'
  const preferredEditorAvailable = isEditorAvailable(preferredEditor)
  const hasAnyAvailable = editors.some(e => e.available)

  return {
    editors,
    showDropdown,
    setShowDropdown,
    preferredEditor,
    preferredEditorInfo,
    preferredEditorName,
    preferredEditorAvailable,
    dropdownRef,
    savePreference,
    isEditorAvailable,
    hasAnyAvailable,
  }
}
