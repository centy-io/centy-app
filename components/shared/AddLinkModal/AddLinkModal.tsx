'use client'

import type { AddLinkModalProps } from './AddLinkModal.types'
import { useAddLinkModal } from './useAddLinkModal'
import { AddLinkModalBody } from './AddLinkModalBody'
import { InfoButton } from './InfoButton'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function AddLinkModal(props: AddLinkModalProps) {
  const state = useAddLinkModal(props)
  const { isEditMode } = state

  return (
    <div className="link-modal-overlay">
      <div className="link-modal" ref={state.modalRef}>
        <div className="link-modal-header">
          <h3 className="link-modal-title">
            {isEditMode ? 'Edit Link' : 'Add Link'}
          </h3>
          <div className="link-modal-header-actions">
            {!isEditMode && (
              <InfoButton>
                Links connect items to express relationships. Use
                &quot;blocks&quot; when this item must be resolved first,
                &quot;fixes&quot; to reference the issue being resolved,
                &quot;implements&quot; for features tied to a requirement,
                &quot;duplicates&quot; for identical issues, or
                &quot;relates-to&quot; for general associations. Both items get
                the link — the inverse is created automatically.
              </InfoButton>
            )}
            <button className="link-modal-close" onClick={props.onClose}>
              x
            </button>
          </div>
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
            onClick={() => {
              void state.handleCreateLink()
            }}
            disabled={
              state.loading ||
              !state.selectedTarget ||
              !state.selectedLinkType ||
              (isEditMode && state.selectedLinkType === state.originalLinkType)
            }
          >
            {state.loading
              ? isEditMode
                ? 'Saving...'
                : 'Creating...'
              : isEditMode
                ? 'Save'
                : 'Create Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
