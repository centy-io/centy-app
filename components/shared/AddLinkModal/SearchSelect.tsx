'use client'

import { useRef, useState } from 'react'
import type { EntityItem } from './AddLinkModal.types'
import { Dropdown } from './SearchSelectDropdown'

interface SearchSelectProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  setSelectedTarget: (item: EntityItem | null) => void
  getEntityLabel: (item: EntityItem) => string
}

function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      className="search-select-clear"
      type="button"
      aria-label="Clear selection"
      onMouseDown={e => void e.preventDefault()}
      onClick={onClear}
    >
      ×
    </button>
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
    const { relatedTarget } = e
    if (
      relatedTarget instanceof Node &&
      containerRef.current?.contains(relatedTarget)
    )
      return
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
          onFocus={() => {
            if (!selectedTarget) setIsOpen(true)
          }}
          placeholder="Search by title or number..."
          readOnly={!!selectedTarget}
        />
        {selectedTarget && <ClearButton onClear={handleClear} />}
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
