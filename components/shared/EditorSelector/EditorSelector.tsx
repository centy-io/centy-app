'use client'

import '@/styles/components/EditorSelector.css'
import type { EditorSelectorProps } from './EditorSelector.types'
import { useEditorSelector } from './useEditorSelector'
import { VscodeIcon, TerminalIcon } from './EditorIcons'
import { EditorDropdown } from './EditorDropdown'
import { EditorType } from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function EditorSelector({
  onOpenInVscode,
  onOpenInTerminal,
  disabled,
  loading,
}: EditorSelectorProps) {
  const resolvedDisabled = disabled !== undefined ? disabled : false
  const resolvedLoading = loading !== undefined ? loading : false
  const state = useEditorSelector(
    onOpenInVscode,
    onOpenInTerminal,
    resolvedDisabled,
    resolvedLoading
  )

  if (!state.hasAnyAvailable && state.editors.length > 0) {
    return (
      <span
        className="editor-unavailable-hint"
        title="No editors are available. Install VS Code or use Terminal."
      >
        No editors available
      </span>
    )
  }

  if (state.editors.length === 0) {
    return null
  }

  return (
    <div className="editor-selector" ref={state.dropdownRef}>
      <div className="editor-selector-button-group">
        <button
          className={`editor-primary-btn ${state.preferredEditor === EditorType.TERMINAL ? 'terminal' : 'vscode'}`}
          onClick={state.handlePrimaryClick}
          disabled={
            resolvedDisabled ||
            resolvedLoading ||
            !state.preferredEditorAvailable
          }
          title={
            state.preferredEditorAvailable
              ? state.preferredEditorInfo
                ? state.preferredEditorInfo.description
                : ''
              : `${state.preferredEditorName} is not available`
          }
        >
          <span className="editor-icon">
            {state.preferredEditor === EditorType.TERMINAL ? (
              <TerminalIcon />
            ) : (
              <VscodeIcon />
            )}
          </span>
          {resolvedLoading
            ? 'Opening...'
            : `Open in ${state.preferredEditorName}`}
        </button>
        <button
          className={`editor-dropdown-btn ${state.preferredEditor === EditorType.TERMINAL ? 'terminal' : 'vscode'}`}
          onClick={() => state.setShowDropdown(!state.showDropdown)}
          disabled={resolvedDisabled || resolvedLoading}
          aria-label="Select editor"
          aria-expanded={state.showDropdown}
          aria-haspopup="listbox"
        >
          <span
            className={`editor-dropdown-arrow ${state.showDropdown ? 'open' : ''}`}
          >
            &#9660;
          </span>
        </button>
      </div>

      {state.showDropdown && (
        <EditorDropdown
          editors={state.editors}
          preferredEditor={state.preferredEditor}
          onSelectEditor={state.handleSelectEditor}
        />
      )}
    </div>
  )
}
