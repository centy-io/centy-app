'use client'

import '@/styles/components/MoveModal.css'
import type { DuplicateModalProps } from './DuplicateModal.types'
import { useDuplicateModal } from './useDuplicateModal'
import { DuplicateModalBody } from './DuplicateModalBody'

export function DuplicateModal(props: DuplicateModalProps) {
  const state = useDuplicateModal(props)

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={state.modalRef}>
        <div className="move-modal-header">
          <h3>
            Duplicate {props.entityType === 'issue' ? 'Issue' : 'Document'}
          </h3>
          <button className="move-modal-close" onClick={props.onClose}>
            x
          </button>
        </div>

        <DuplicateModalBody props={props} state={state} />

        <div className="move-modal-footer">
          <button className="move-modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
          <button
            className="move-modal-submit"
            onClick={state.handleDuplicate}
            disabled={
              state.loading ||
              !state.selectedProject ||
              state.projects.length === 0
            }
          >
            {state.loading ? 'Duplicating...' : 'Duplicate'}
          </button>
        </div>
      </div>
    </div>
  )
}
