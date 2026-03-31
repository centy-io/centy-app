'use client'

import { useRef, useEffect } from 'react'
import '@/styles/components/WorkspaceModeModal.css'
import { WorkspaceMode } from './WorkspaceMode'
import { WORKSPACE_OPTIONS } from './WORKSPACE_OPTIONS'

interface WorkspaceModeModalProps {
  issueNumber?: number
  onClose: () => void
  onSelect: (mode: WorkspaceMode) => void
}

function useWorkspaceModalDismiss(
  modalRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])
}

export function WorkspaceModeModal({
  issueNumber,
  onClose,
  onSelect,
}: WorkspaceModeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  useWorkspaceModalDismiss(modalRef, onClose)

  return (
    <div className="workspace-modal-overlay">
      <div className="workspace-modal" ref={modalRef}>
        <div className="workspace-modal-header">
          <h3 className="workspace-modal-title">
            Open Workspace for Issue #{issueNumber}
          </h3>
          <button onClick={onClose} className="workspace-modal-close">
            Cancel
          </button>
        </div>

        <div className="workspace-modal-body">
          <p className="workspace-modal-description">
            Choose where to open the workspace:
          </p>

          <div className="workspace-modal-options">
            {WORKSPACE_OPTIONS.map(option => (
              <button
                key={option.mode}
                onClick={() => onSelect(option.mode)}
                className="workspace-option"
              >
                <div className="workspace-option-title">{option.title}</div>
                <div className="workspace-option-description">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
