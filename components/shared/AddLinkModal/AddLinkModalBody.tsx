'use client'

import type { useAddLinkModal } from './useAddLinkModal'
import { LinkPreview } from './LinkPreview'

type ModalState = ReturnType<typeof useAddLinkModal>

function LinkTypeSelect({ state }: { state: ModalState }) {
  if (state.loadingTypes)
    return <div className="link-modal-loading">Loading...</div>
  return (
    <select
      value={state.selectedLinkType}
      onChange={e => state.setSelectedLinkType(e.target.value)}
      className="link-modal-select"
    >
      {state.linkTypes.map(type => (
        <option className="link-modal-option" key={type.name} value={type.name}>
          {type.name} {type.description ? `- ${type.description}` : ''}
        </option>
      ))}
    </select>
  )
}

function SearchResults({ state }: { state: ModalState }) {
  const isSelected = (id: string) =>
    state.selectedTarget !== null && state.selectedTarget.id === id
  if (state.loadingSearch)
    return <div className="link-modal-loading">Searching...</div>
  if (state.searchResults.length === 0)
    return <div className="link-modal-empty">No items found</div>
  return (
    <ul className="link-modal-list">
      {state.searchResults.slice(0, 10).map(item => (
        <li
          key={item.id}
          className={`link-modal-item ${isSelected(item.id) ? 'selected' : ''}`}
          onClick={() => state.setSelectedTarget(item)}
        >
          <span className={`link-type-icon link-type-${item.type}`}>
            {item.type === 'issue' ? '!' : 'D'}
          </span>
          <span className="link-modal-item-label">
            {state.getEntityLabel(item)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function AddLinkModalBody({ state }: { state: ModalState }) {
  const tabClass = (f: string) =>
    `link-modal-tab ${state.targetTypeFilter === f ? 'active' : ''}`
  return (
    <>
      <div className="link-modal-field">
        <label className="link-modal-label">Link Type</label>
        <LinkTypeSelect state={state} />
      </div>
      <div className="link-modal-field">
        <label className="link-modal-label">Target Type</label>
        <div className="link-modal-tabs">
          <button
            className={tabClass('issue')}
            onClick={() => state.setTargetTypeFilter('issue')}
          >
            Issues
          </button>
          <button
            className={tabClass('doc')}
            onClick={() => state.setTargetTypeFilter('doc')}
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
          onChange={e => state.setSearchQuery(e.target.value)}
          placeholder="Search by title or number..."
          className="link-modal-input"
        />
      </div>
      <div className="link-modal-field">
        <label className="link-modal-label">Select Target</label>
        <div className="link-modal-results">
          <SearchResults state={state} />
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
