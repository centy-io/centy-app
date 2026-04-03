'use client'

import '@/styles/components/EditorSelector.css'
import type { EditorSelectorProps } from './EditorSelector.types'
import { useEditorSelector } from './useEditorSelector'
import { EditorDropdown } from './EditorDropdown'
import { PrimaryButton } from './PrimaryButton'

export function EditorSelector({
  onOpenInVscode,
  onOpenInTerminal,
  disabled,
  loading,
}: EditorSelectorProps) {
  const resolvedDisabled = disabled ?? false
  const resolvedLoading = loading ?? false
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
        title="No editors are available."
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
        <PrimaryButton
          preferredEditor={state.preferredEditor}
          preferredEditorAvailable={state.preferredEditorAvailable}
          preferredEditorName={state.preferredEditorName}
          preferredEditorInfo={state.preferredEditorInfo}
          disabled={resolvedDisabled}
          loading={resolvedLoading}
          onClick={() => {
            void state.handlePrimaryClick()
          }}
        />
        <button
          className={`editor-dropdown-btn ${state.preferredEditor === 'terminal' ? 'terminal' : 'vscode'}`}
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
          onSelectEditor={editorId => {
            void state.handleSelectEditor(editorId)
          }}
        />
      )}
    </div>
  )
}
