'use client'

import '@/styles/components/MoveModal.css'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveModal } from './useMoveModal'
import { MoveModalBody } from './MoveModalBody'

export function MoveModal({
  entityType,
  entityId,
  entityTitle,
  currentProjectPath,
  onClose,
  onMoved,
}: MoveModalProps) {
  const {
    modalRef,
    projects,
    selectedProject,
    setSelectedProject,
    newSlug,
    setNewSlug,
    loading,
    loadingProjects,
    error,
    handleMove,
    selectedProjectInfo,
  } = useMoveModal({
    entityType,
    entityId,
    currentProjectPath,
    onClose,
    onMoved,
  })

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={modalRef}>
        <div className="move-modal-header">
          <h3>Move {entityType === 'issue' ? 'Issue' : 'Document'}</h3>
          <button className="move-modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <MoveModalBody
          entityType={entityType}
          entityId={entityId}
          entityTitle={entityTitle}
          error={error}
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          loadingProjects={loadingProjects}
          newSlug={newSlug}
          setNewSlug={setNewSlug}
          selectedProjectInfo={selectedProjectInfo}
        />

        <div className="move-modal-footer">
          <button className="move-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="move-modal-submit"
            onClick={handleMove}
            disabled={loading || !selectedProject || projects.length === 0}
          >
            {loading ? 'Moving...' : 'Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
