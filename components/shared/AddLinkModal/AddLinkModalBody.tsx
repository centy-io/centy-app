'use client'

import type { useAddLinkModal } from './useAddLinkModal'
import { LinkPreview } from './LinkPreview'
import { LinkTypeSelect } from './LinkTypeSelect'
import { SearchSelect } from './SearchSelect'

interface AddLinkModalBodyProps {
  state: ReturnType<typeof useAddLinkModal>
}

export function AddLinkModalBody({ state }: AddLinkModalBodyProps) {
  return (
    <>
      <div className="link-modal-field">
        <label className="link-modal-label">Link Type</label>
        <LinkTypeSelect
          loadingTypes={state.loadingTypes}
          linkTypes={state.linkTypes}
          selectedLinkType={state.selectedLinkType}
          setSelectedLinkType={state.setSelectedLinkType}
        />
      </div>
      <div className="link-modal-field">
        <label className="link-modal-label">Target Item</label>
        <SearchSelect
          searchQuery={state.searchQuery}
          setSearchQuery={state.setSearchQuery}
          loadingSearch={state.loadingSearch}
          searchResults={state.searchResults}
          selectedTarget={state.selectedTarget}
          setSelectedTarget={state.setSelectedTarget}
          getEntityLabel={state.getEntityLabel}
        />
      </div>
      {state.selectedTarget && state.selectedLinkType && (
        <LinkPreview
          entityType={state.entityType}
          selectedLinkType={state.selectedLinkType}
          selectedTarget={state.selectedTarget}
          getInverseLinkType={state.getInverseLinkType}
        />
      )}
    </>
  )
}
