'use client'

import { EditorType } from '@/gen/centy_pb'
import '@/styles/components/EditorSelector.css'
import type { EditorSelectorProps } from './EditorSelector.types'
import { useEditorSelector } from './useEditorSelector'
import { VscodeIcon, TerminalIcon } from './EditorIcons'
import { EditorDropdown } from './EditorDropdown'

export function EditorSelector({
  onOpenInVscode,
  onOpenInTerminal,
  disabled = false,
  loading = false,
}: EditorSelectorProps) {
  const {
    editors,
    dropdownRef,
    showDropdown,
    setShowDropdown,
    preferredEditor,
    preferredEditorInfo,
    preferredEditorName,
    preferredEditorAvailable,
    handlePrimaryClick,
    handleSelectEditor,
    hasAnyAvailable,
  } = useEditorSelector(onOpenInVscode, onOpenInTerminal, disabled, loading)

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
      <div className="editor-selector-button-group">
        <button
          className={`editor-primary-btn ${preferredEditor === EditorType.TERMINAL ? 'terminal' : 'vscode'}`}
          onClick={handlePrimaryClick}
          disabled={disabled || loading || !preferredEditorAvailable}
          title={
            preferredEditorAvailable
              ? preferredEditorInfo?.description
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
          <span
            className={`editor-dropdown-arrow ${showDropdown ? 'open' : ''}`}
          >
            &#9660;
          </span>
        </button>
      </div>

      {showDropdown && (
        <EditorDropdown
          editors={editors}
          preferredEditor={preferredEditor}
          onSelectEditor={handleSelectEditor}
        />
      )}
    </div>
  )
}
