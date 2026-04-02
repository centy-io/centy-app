import { useState, useCallback, useEffect, useRef } from 'react'
import { EDITOR_PREFERENCE_KEY } from './EditorSelector.types'
import type { EditorInfo } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

export function useEditorPreference() {
  const { editors } = useDaemonStatus()
  const [showDropdown, setShowDropdown] = useState(false)
  const [preferredEditor, setPreferredEditor] = useState<string>('terminal')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const saved = localStorage.getItem(EDITOR_PREFERENCE_KEY)
      if (!saved) return
      setPreferredEditor(saved)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const savePreference = useCallback((editorId: string) => {
    setPreferredEditor(editorId)
    localStorage.setItem(EDITOR_PREFERENCE_KEY, editorId)
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
    (editorId: string): EditorInfo | undefined => {
      return editors.find(e => e.editorId === editorId)
    },
    [editors]
  )

  const isEditorAvailable = useCallback(
    (editorId: string): boolean => {
      const editor = getEditorInfo(editorId)
      return editor !== undefined ? editor.available : false
    },
    [getEditorInfo]
  )

  const preferredEditorInfo = getEditorInfo(preferredEditor)
  const preferredEditorName =
    (preferredEditorInfo ? preferredEditorInfo.name : '') || 'Terminal'
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
