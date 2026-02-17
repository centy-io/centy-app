'use client'

import '@/styles/components/MoveModal.css'
import type { DuplicateModalProps } from './DuplicateModal.types'
import { useDuplicateModal } from './useDuplicateModal'
import { DuplicateModalBody } from './DuplicateModalBody'

export function DuplicateModal(props: DuplicateModalProps) {
  const {
    modalRef,
    projects,
    selectedProject,
    setSelectedProject,
    newTitle,
    setNewTitle,
    newSlug,
    setNewSlug,
    loading,
    loadingProjects,
    error,
    handleDuplicate,
    selectedProjectInfo,
    isSameProject,
  } = useDuplicateModal(props)

  const { entityType, entityTitle, entitySlug, currentProjectPath, onClose } =
    props

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={modalRef}>
        <div className="move-modal-header">
          <h3>Duplicate {entityType === 'issue' ? 'Issue' : 'Document'}</h3>
          <button className="move-modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <DuplicateModalBody
          entityType={entityType}
          entityTitle={entityTitle}
          entitySlug={entitySlug}
          currentProjectPath={currentProjectPath}
          error={error}
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          loadingProjects={loadingProjects}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newSlug={newSlug}
          setNewSlug={setNewSlug}
          selectedProjectInfo={selectedProjectInfo}
          isSameProject={isSameProject}
        />

        <div className="move-modal-footer">
          <button className="move-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="move-modal-submit"
            onClick={handleDuplicate}
            disabled={loading || !selectedProject || projects.length === 0}
          >
            {loading ? 'Duplicating...' : 'Duplicate'}
          </button>
        </div>
      </div>
    </div>
  )
}
