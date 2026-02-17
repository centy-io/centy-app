import type { EntityItem } from './AddLinkModal.types'
import { getEntityLabel } from './AddLinkModal.types'

interface SearchResultsProps {
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  onSelect: (item: EntityItem) => void
}

export function SearchResults({
  loadingSearch,
  searchResults,
  selectedTarget,
  onSelect,
}: SearchResultsProps) {
  return (
    <div className="link-modal-field">
      <label>Select Target</label>
      <div className="link-modal-results">
        {loadingSearch ? (
          <div className="link-modal-loading">Searching...</div>
        ) : searchResults.length === 0 ? (
          <div className="link-modal-empty">No items found</div>
        ) : (
          <ul className="link-modal-list">
            {searchResults.slice(0, 10).map(item => (
              <li
                key={item.id}
                className={`link-modal-item ${selectedTarget?.id === item.id ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
              >
                <span className={`link-type-icon link-type-${item.type}`}>
                  {item.type === 'issue' ? '!' : 'D'}
                </span>
                <span className="link-modal-item-label">
                  {getEntityLabel(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
