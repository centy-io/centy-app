'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { EditorType, type EditorInfo } from '@/gen/centy_pb'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import '@/styles/components/EditorSelector.css'

const EDITOR_PREFERENCE_KEY = 'centy-preferred-editor'

interface EditorSelectorProps {
  onOpenInVscode: () => Promise<void>
  onOpenInTerminal: () => Promise<void>
  disabled?: boolean
  loading?: boolean
}

function useEditorPreference() {
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

function useDropdownClose(
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  showDropdown: boolean,
  setShowDropdown: (value: boolean) => void
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

function useEditorActions(
  editors: EditorInfo[],
  disabled: boolean,
  loading: boolean,
  onOpenInVscode: () => Promise<void>,
  onOpenInTerminal: () => Promise<void>,
  savePreference: (editorType: EditorType) => void,
  setShowDropdown: (value: boolean) => void
) {
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

  const openEditor = useCallback(
    async (editorType: EditorType) => {
      if (editorType === EditorType.VSCODE) {
        await onOpenInVscode()
      } else if (editorType === EditorType.TERMINAL) {
        await onOpenInTerminal()
      }
    },
    [onOpenInVscode, onOpenInTerminal]
  )

  const handleSelectEditor = useCallback(
    async (editorType: EditorType) => {
      if (disabled || loading) return
      if (!isEditorAvailable(editorType)) return

      savePreference(editorType)
      setShowDropdown(false)
      await openEditor(editorType)
    },
    [
      disabled,
      loading,
      isEditorAvailable,
      savePreference,
      setShowDropdown,
      openEditor,
    ]
  )

  return { getEditorInfo, isEditorAvailable, openEditor, handleSelectEditor }
}

function EditorDropdown({
  editors,
  preferredEditor,
  handleSelectEditor,
}: {
  editors: EditorInfo[]
  preferredEditor: EditorType
  handleSelectEditor: (editorType: EditorType) => void
}) {
  return (
    <ul className="editor-dropdown" role="listbox" aria-label="Editors">
      {editors.map(editor => (
        <li
          key={editor.editorType}
          role="option"
          aria-selected={editor.editorType === preferredEditor}
          aria-disabled={!editor.available}
          className={`editor-option ${editor.editorType === preferredEditor ? 'selected' : ''} ${!editor.available ? 'disabled' : ''}`}
          onClick={() =>
            editor.available && handleSelectEditor(editor.editorType)
          }
          title={
            editor.available
              ? editor.description
              : `${editor.name} is not available`
          }
        >
          <span className="editor-option-icon">
            {editor.editorType === EditorType.TERMINAL ? (
              <TerminalIcon />
            ) : (
              <VscodeIcon />
            )}
          </span>
          <div className="editor-option-content">
            <span className="editor-option-name">{editor.name}</span>
            {!editor.available && (
              <span className="editor-option-unavailable">Not available</span>
            )}
          </div>
          {editor.editorType === preferredEditor && editor.available && (
            <span className="editor-option-check">&#10003;</span>
          )}
        </li>
      ))}
    </ul>
  )
}

function EditorButtonGroup({
  preferredEditor,
  preferredEditorAvailable,
  preferredEditorInfo,
  preferredEditorName,
  handlePrimaryClick,
  disabled,
  loading,
  showDropdown,
  setShowDropdown,
}: {
  preferredEditor: EditorType
  preferredEditorAvailable: boolean
  preferredEditorInfo: EditorInfo | undefined
  preferredEditorName: string
  handlePrimaryClick: () => void
  disabled: boolean
  loading: boolean
  showDropdown: boolean
  setShowDropdown: (value: boolean) => void
}) {
  return (
    <div className="editor-selector-button-group">
      <button
        className={`editor-primary-btn ${preferredEditor === EditorType.TERMINAL ? 'terminal' : 'vscode'}`}
        onClick={handlePrimaryClick}
        disabled={disabled || loading || !preferredEditorAvailable}
        title={
          preferredEditorAvailable
            ? preferredEditorInfo
              ? preferredEditorInfo.description
              : ''
            : `${preferredEditorName} is not available`
        }
      >
        <span className="editor-icon">
          {preferredEditor === EditorType.TERMINAL ? (
            <TerminalIcon />
          ) : (
            <VscodeIcon />
          )}
        </span>
        {loading ? 'Opening...' : `Open in ${preferredEditorName}`}
      </button>
      <button
        className={`editor-dropdown-btn ${preferredEditor === EditorType.TERMINAL ? 'terminal' : 'vscode'}`}
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || loading}
        aria-label="Select editor"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
      >
        <span className={`editor-dropdown-arrow ${showDropdown ? 'open' : ''}`}>
          &#9660;
        </span>
      </button>
    </div>
  )
}

export function EditorSelector({
  onOpenInVscode,
  onOpenInTerminal,
  disabled = false,
  loading = false,
}: EditorSelectorProps) {
  const { editors } = useDaemonStatus()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { preferredEditor, savePreference } = useEditorPreference()
  useDropdownClose(dropdownRef, showDropdown, setShowDropdown)

  const { getEditorInfo, isEditorAvailable, openEditor, handleSelectEditor } =
    useEditorActions(
      editors,
      disabled,
      loading,
      onOpenInVscode,
      onOpenInTerminal,
      savePreference,
      setShowDropdown
    )

  const preferredEditorInfo = getEditorInfo(preferredEditor)
  const preferredEditorName =
    (preferredEditorInfo ? preferredEditorInfo.name : '') || 'VS Code'
  const preferredEditorAvailable = isEditorAvailable(preferredEditor)

  const handlePrimaryClick = useCallback(async () => {
    if (disabled || loading || !preferredEditorAvailable) return
    await openEditor(preferredEditor)
  }, [disabled, loading, preferredEditorAvailable, openEditor, preferredEditor])

  const hasAnyAvailable = editors.some(e => e.available)
  if (!hasAnyAvailable && editors.length > 0) {
    return (
      <span
        className="editor-unavailable-hint"
        title="No editors are available. Install VS Code or use Terminal."
      >
        No editors available
      </span>
    )
  }

  if (editors.length === 0) {
    return null
  }

  return (
    <div className="editor-selector" ref={dropdownRef}>
      <EditorButtonGroup
        preferredEditor={preferredEditor}
        preferredEditorAvailable={preferredEditorAvailable}
        preferredEditorInfo={preferredEditorInfo}
        preferredEditorName={preferredEditorName}
        handlePrimaryClick={handlePrimaryClick}
        disabled={disabled}
        loading={loading}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />

      {showDropdown && (
        <EditorDropdown
          editors={editors}
          preferredEditor={preferredEditor}
          handleSelectEditor={handleSelectEditor}
        />
      )}
    </div>
  )
}

function VscodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.583 17.222L8.528 8.167 2.75 13.944v2.111l4.917 4.195 9.916-3.028zm0-10.444L8.528 15.833 2.75 10.056V7.944l4.917-4.194 9.916 3.028zM2.75 10.056L8.528 12 2.75 13.944v-3.888zm14.833 10.166L21.25 18v-12l-3.667 2.222v7.778l.028 2.222z" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  )
}
