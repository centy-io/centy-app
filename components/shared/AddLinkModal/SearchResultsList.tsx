'use client'

import type { EntityItem } from './AddLinkModal.types'

interface SearchResultsListProps {
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  getEntityLabel: (item: EntityItem) => string
  setSelectedTarget: (item: EntityItem) => void
}

export function SearchResultsList({
  loadingSearch,
  searchResults,
  selectedTarget,
  getEntityLabel,
  setSelectedTarget,
}: SearchResultsListProps) {
  if (loadingSearch)
    return <div className="link-modal-loading">Searching...</div>
  if (searchResults.length === 0)
    return <div className="link-modal-empty">No items found</div>
  return (
    <ul className="link-modal-list">
      {searchResults.slice(0, 10).map(item => (
        <li
          key={item.id}
          className={`link-modal-item ${selectedTarget && selectedTarget.id === item.id ? 'selected' : ''}`}
          onClick={() => {
            setSelectedTarget(item)
          }}
        >
          <span className={`link-type-icon link-type-${item.type}`}>
            {item.type === 'issue' ? '!' : 'D'}
          </span>
          <span className="link-modal-item-label">{getEntityLabel(item)}</span>
        </li>
      ))}
    </ul>
  )
}
