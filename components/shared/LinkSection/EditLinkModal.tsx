'use client'

import { LinkTypeSelect } from '../AddLinkModal/LinkTypeSelect'
import { useEditLinkModal } from './useEditLinkModal'
import type { Link as LinkType } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface EditLinkModalProps {
  link: LinkType
  onClose: () => void
  onLinkUpdated: () => void
}

export function EditLinkModal({
  link,
  onClose,
  onLinkUpdated,
}: EditLinkModalProps) {
  const state = useEditLinkModal(link, onClose, onLinkUpdated)

  return (
    <div className="link-modal-overlay">
      <div className="link-modal" ref={state.modalRef}>
        <div className="link-modal-header">
          <h3 className="link-modal-title">Edit Link</h3>
          <button className="link-modal-close" onClick={onClose}>
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
          <div className="link-modal-field">
            <label className="link-modal-label">Link Type</label>
            <LinkTypeSelect
              loadingTypes={state.loadingTypes}
              linkTypes={state.linkTypes}
              selectedLinkType={state.selectedLinkType}
              setSelectedLinkType={state.setSelectedLinkType}
            />
          </div>
        </div>

        <div className="link-modal-footer">
          <button className="link-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="link-modal-submit"
            onClick={() => {
              void state.handleSave()
            }}
            disabled={
              state.loading ||
              !state.selectedLinkType ||
              state.selectedLinkType === link.linkType
            }
          >
            {state.loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
