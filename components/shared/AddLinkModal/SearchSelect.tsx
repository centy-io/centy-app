'use client'

import { useRef, useState } from 'react'
import type { EntityItem } from './AddLinkModal.types'
import { SearchResultsList } from './SearchResultsList'

interface SearchSelectProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  setSelectedTarget: (item: EntityItem | null) => void
  getEntityLabel: (item: EntityItem) => string
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
    if (!(related instanceof Node) || !containerRef.current?.contains(related))
      setIsOpen(false)
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
          onFocus={selectedTarget ? undefined : () => void setIsOpen(true)}
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
          <SearchResultsList
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
