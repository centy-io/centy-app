'use client'

import type { useAddLinkModal } from './useAddLinkModal'
import { LinkPreview } from './LinkPreview'
import { LinkTypeSelect } from './LinkTypeSelect'
import { SearchResultsList } from './SearchResultsList'

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
        <label className="link-modal-label">Target Type</label>
        <div className="link-modal-tabs">
          <button
            className={`link-modal-tab ${state.targetTypeFilter === 'issue' ? 'active' : ''}`}
            onClick={() => {
              state.setTargetTypeFilter('issue')
            }}
          >
            Issues
          </button>
          <button
            className={`link-modal-tab ${state.targetTypeFilter === 'doc' ? 'active' : ''}`}
            onClick={() => {
              state.setTargetTypeFilter('doc')
            }}
          >
            Docs
          </button>
        </div>
      </div>
      <div className="link-modal-field">
        <label className="link-modal-label">Search</label>
        <input
          type="text"
          value={state.searchQuery}
          onChange={e => {
            state.setSearchQuery(e.target.value)
          }}
          placeholder="Search by title or number..."
          className="link-modal-input"
        />
      </div>
      <div className="link-modal-field">
        <label className="link-modal-label">Select Target</label>
        <div className="link-modal-results">
          <SearchResultsList
            loadingSearch={state.loadingSearch}
            searchResults={state.searchResults}
            selectedTarget={state.selectedTarget}
            getEntityLabel={state.getEntityLabel}
            setSelectedTarget={state.setSelectedTarget}
          />
        </div>
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
