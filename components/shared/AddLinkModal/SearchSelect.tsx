'use client'

import { useRef, useState } from 'react'
import type { EntityItem } from './AddLinkModal.types'

interface SearchSelectProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  setSelectedTarget: (item: EntityItem | null) => void
  getEntityLabel: (item: EntityItem) => string
}

interface DropdownProps {
  loadingSearch: boolean
  searchResults: EntityItem[]
  getEntityLabel: (item: EntityItem) => string
  onSelect: (item: EntityItem) => void
}

function Dropdown({
  loadingSearch,
  searchResults,
  getEntityLabel,
  onSelect,
}: DropdownProps) {
  if (loadingSearch)
    return <div className="link-modal-loading">Searching...</div>
  if (searchResults.length === 0)
    return <div className="link-modal-empty">No items found</div>
  return (
    <ul className="link-modal-list">
      {searchResults.slice(0, 10).map(item => (
        <li
          key={item.id}
          className="link-modal-item"
          onMouseDown={e => void e.preventDefault()}
          onClick={() => void onSelect(item)}
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

export function SearchSelect({
  searchQuery,
  setSearchQuery,
  loadingSearch,
  searchResults,
  selectedTarget,
  setSelectedTarget,
  getEntityLabel,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (selectedTarget) setSelectedTarget(null)
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  function handleBlur(e: React.FocusEvent) {
    const related = e.relatedTarget
    if (
      !(related instanceof Node) ||
      !containerRef.current?.contains(related)
    ) {
      setIsOpen(false)
    }
  }

  function handleSelect(item: EntityItem) {
    setSelectedTarget(item)
    setSearchQuery(getEntityLabel(item))
    setIsOpen(false)
  }

  function handleClear() {
    setSelectedTarget(null)
    setSearchQuery('')
    setIsOpen(true)
    containerRef.current?.querySelector('input')?.focus()
  }

  return (
    <div className="search-select" ref={containerRef} onBlur={handleBlur}>
      <div className="search-select-input-wrapper">
        <input
          type="text"
          className="link-modal-input search-select-input"
          value={selectedTarget ? getEntityLabel(selectedTarget) : searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (!selectedTarget) setIsOpen(true)
          }}
          placeholder="Search by title or number..."
          readOnly={!!selectedTarget}
        />
        {selectedTarget && (
          <button
            className="search-select-clear"
            type="button"
            aria-label="Clear selection"
            onMouseDown={e => void e.preventDefault()}
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>
      {isOpen && (
        <div className="search-select-dropdown">
          <Dropdown
            loadingSearch={loadingSearch}
            searchResults={searchResults}
            getEntityLabel={getEntityLabel}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  )
}
