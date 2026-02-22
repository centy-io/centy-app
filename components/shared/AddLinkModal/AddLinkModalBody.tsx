'use client'

import type { useAddLinkModal } from './useAddLinkModal'
import { LinkPreview } from './LinkPreview'

interface AddLinkModalBodyProps {
  state: ReturnType<typeof useAddLinkModal>
}

// eslint-disable-next-line max-lines-per-function
export function AddLinkModalBody({ state }: AddLinkModalBodyProps) {
  return (
    <>
      <div className="link-modal-field">
        <label className="link-modal-label">Link Type</label>
        {state.loadingTypes ? (
          <div className="link-modal-loading">Loading...</div>
        ) : (
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
        )}
      </div>

      <div className="link-modal-field">
        <label className="link-modal-label">Target Type</label>
        <div className="link-modal-tabs">
          <button
            className={`link-modal-tab ${state.targetTypeFilter === 'issue' ? 'active' : ''}`}
            onClick={() => state.setTargetTypeFilter('issue')}
          >
            Issues
          </button>
          <button
            className={`link-modal-tab ${state.targetTypeFilter === 'doc' ? 'active' : ''}`}
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
          {state.loadingSearch ? (
            <div className="link-modal-loading">Searching...</div>
          ) : state.searchResults.length === 0 ? (
            <div className="link-modal-empty">No items found</div>
          ) : (
            <ul className="link-modal-list">
              {state.searchResults.slice(0, 10).map(item => (
                <li
                  key={item.id}
                  className={`link-modal-item ${state.selectedTarget && state.selectedTarget.id === item.id ? 'selected' : ''}`}
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
          )}
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
