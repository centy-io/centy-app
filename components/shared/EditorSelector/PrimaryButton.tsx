'use client'

import type { EditorInfo } from '@/gen/centy_pb'

interface PrimaryButtonProps {
  preferredEditor: string
  preferredEditorAvailable: boolean
  preferredEditorName: string
  preferredEditorInfo: EditorInfo | undefined
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function PrimaryButton({
  preferredEditor,
  preferredEditorAvailable,
  preferredEditorName,
  preferredEditorInfo,
  disabled,
  loading,
  onClick,
}: PrimaryButtonProps) {
  const colorClass = preferredEditor === 'terminal' ? 'terminal' : 'vscode'
  const titleText = preferredEditorAvailable
    ? preferredEditorInfo
      ? preferredEditorInfo.description
      : ''
    : `${preferredEditorName} is not available`

  return (
    <button
      className={`editor-primary-btn ${colorClass}`}
      onClick={onClick}
      disabled={disabled || !preferredEditorAvailable}
      title={titleText}
    >
      {loading ? 'Opening...' : `Open in ${preferredEditorName}`}
    </button>
  )
}
