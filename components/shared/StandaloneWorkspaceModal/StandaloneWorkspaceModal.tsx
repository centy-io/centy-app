'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/StandaloneWorkspaceModal.css'
import type { StandaloneWorkspaceModalProps } from './StandaloneWorkspaceModal.types'
import { useStandaloneWorkspace } from './useStandaloneWorkspace'
import { EditorOptions } from './EditorOptions'
import { WorkspaceFormFields } from './WorkspaceFormFields'

export function StandaloneWorkspaceModal({
  projectPath,
  onClose,
  onCreated,
}: StandaloneWorkspaceModalProps) {
  const {
    modalRef,
    name,
    setName,
    description,
    setDescription,
    ttlHours,
    setTtlHours,
    selectedEditor,
    setSelectedEditor,
    loading,
    error,
    isEditorAvailable,
    hasAvailableEditor,
    handleCreate,
  } = useStandaloneWorkspace(projectPath, onClose, onCreated)

  return (
    <div className="standalone-modal-overlay">
      <div className="standalone-modal" ref={modalRef}>
        <div className="standalone-modal-header">
          <h3>New Standalone Workspace</h3>
          <button className="standalone-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="standalone-modal-body">
          {error && (
            <DaemonErrorMessage
              error={error}
              className="standalone-modal-error"
            />
          )}

          <WorkspaceFormFields
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            ttlHours={ttlHours}
            setTtlHours={setTtlHours}
          />

          <EditorOptions
            selectedEditor={selectedEditor}
            setSelectedEditor={setSelectedEditor}
            isEditorAvailable={isEditorAvailable}
          />
        </div>

        <div className="standalone-modal-footer">
          <button className="standalone-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="standalone-modal-submit"
            onClick={handleCreate}
            disabled={loading || !hasAvailableEditor}
          >
            {loading ? 'Creating...' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </div>
  )
}
