'use client'

import '@/styles/components/EditorSelector.css'
import type { EditorSelectorProps } from './EditorSelector.types'
import { useEditorSelector } from './useEditorSelector'
import { VscodeIcon, TerminalIcon } from './EditorIcons'
import { EditorDropdown } from './EditorDropdown'
import { EditorType } from '@/gen/centy_pb'

type EditorSelectorState = ReturnType<typeof useEditorSelector>

interface PrimaryButtonProps {
  state: EditorSelectorState
  resolvedDisabled: boolean
  resolvedLoading: boolean
}

function PrimaryButton({
  state,
  resolvedDisabled,
  resolvedLoading,
}: PrimaryButtonProps) {
  const isTerminal = state.preferredEditor === EditorType.TERMINAL
  const btnClass = `editor-primary-btn ${isTerminal ? 'terminal' : 'vscode'}`
  const title = state.preferredEditorAvailable
    ? state.preferredEditorInfo
      ? state.preferredEditorInfo.description
      : ''
    : `${state.preferredEditorName} is not available`
  return (
    <button
      className={btnClass}
      onClick={state.handlePrimaryClick}
      disabled={
        resolvedDisabled || resolvedLoading || !state.preferredEditorAvailable
      }
      title={title}
    >
      <span className="editor-icon">
        {isTerminal ? <TerminalIcon /> : <VscodeIcon />}
      </span>
      {resolvedLoading ? 'Opening...' : `Open in ${state.preferredEditorName}`}
    </button>
  )
}

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

  const isTerminal = state.preferredEditor === EditorType.TERMINAL
  return (
    <div className="editor-selector" ref={state.dropdownRef}>
      <div className="editor-selector-button-group">
        <PrimaryButton
          state={state}
          resolvedDisabled={resolvedDisabled}
          resolvedLoading={resolvedLoading}
        />
        <button
          className={`editor-dropdown-btn ${isTerminal ? 'terminal' : 'vscode'}`}
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
