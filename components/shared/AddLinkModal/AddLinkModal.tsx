'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { AddLinkModalProps } from './AddLinkModal.types'
import { useAddLinkModal } from './useAddLinkModal'
import { AddLinkModalBody } from './AddLinkModalBody'

export function AddLinkModal(props: AddLinkModalProps) {
  const state = useAddLinkModal(props)

  return (
    <div className="link-modal-overlay">
      <div className="link-modal" ref={state.modalRef}>
        <div className="link-modal-header">
          <h3>Add Link</h3>
          <button className="link-modal-close" onClick={props.onClose}>
            x
          </button>
        </div>

        <div className="link-modal-body">
          {state.error && (
            <DaemonErrorMessage
              error={state.error}
              className="link-modal-error"
            />
          )}

          <AddLinkModalBody state={state} />
        </div>

        <div className="link-modal-footer">
          <button className="link-modal-cancel" onClick={props.onClose}>
            Cancel
          </button>
          <button
            className="link-modal-submit"
            onClick={state.handleCreateLink}
            disabled={
              state.loading || !state.selectedTarget || !state.selectedLinkType
            }
          >
            {state.loading ? 'Creating...' : 'Create Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
