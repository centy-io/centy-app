'use client'

import '@/styles/components/MoveModal.css'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveModal } from './useMoveModal'
import { MoveModalBody } from './MoveModalBody'

export function MoveModal(props: MoveModalProps) {
  const state = useMoveModal(props)

  return (
    <div className="move-modal-overlay">
      <div className="move-modal" ref={state.modalRef}>
        <div className="move-modal-header">
          <h3 className="move-modal-title">
            Move {props.entityType === 'issue' ? 'Issue' : 'Document'}
          </h3>
          <button className="move-modal-close" onClick={props.onClose}>
            x
          </button>
        </div>
        <MoveModalBody props={props} state={state} />
        <div className="move-modal-footer">
          <button className="move-modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
          <button
            className="move-modal-submit"
            onClick={() => {
              void state.handleMove()
            }}
            disabled={
              state.loading ||
              !state.selectedProject ||
              state.projects.length === 0
            }
          >
            {state.loading ? 'Moving...' : 'Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
