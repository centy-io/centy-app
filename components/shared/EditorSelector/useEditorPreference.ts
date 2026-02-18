import { useState, useCallback, useEffect, useRef } from 'react'
import { EditorType, type EditorInfo } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { EDITOR_PREFERENCE_KEY } from './EditorSelector.types'

// eslint-disable-next-line max-lines-per-function
export function useEditorPreference() {
  const { editors } = useDaemonStatus()
  const [showDropdown, setShowDropdown] = useState(false)
  const [preferredEditor, setPreferredEditor] = useState<EditorType>(
    EditorType.VSCODE
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

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
  }, [showDropdown])

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
