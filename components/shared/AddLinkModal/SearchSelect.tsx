'use client'

import { useRef, useState, useEffect } from 'react'
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
  locked?: boolean
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

function useDropdownOpen(
  loadingSearch: boolean,
  selectedTarget: EntityItem | null
) {
  const [isOpen, setIsOpen] = useState(false)
  const prevLoadingRef = useRef(false)
  useEffect(() => {
    if (prevLoadingRef.current && !loadingSearch && !selectedTarget)
      setIsOpen(true)
    prevLoadingRef.current = loadingSearch
  }, [loadingSearch, selectedTarget])
  return { isOpen, setIsOpen }
}

export function SearchSelect({
  searchQuery,
  setSearchQuery,
  loadingSearch,
  searchResults,
  selectedTarget,
  setSelectedTarget,
  getEntityLabel,
  locked,
}: SearchSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, setIsOpen } = useDropdownOpen(loadingSearch, selectedTarget)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (locked === true) return
    if (selectedTarget) setSelectedTarget(null)
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  function handleBlur({ relatedTarget }: React.FocusEvent) {
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
          onFocus={() => !selectedTarget && void setIsOpen(true)}
          placeholder="Search by title or number..."
          readOnly={!!selectedTarget}
        />
        {selectedTarget && locked !== true && (
          <ClearButton onClear={handleClear} />
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
