'use client'

import { useRef } from 'react'
import type { EntityItem } from './AddLinkModal.types'
import { Dropdown, useDropdownOpen } from './SearchSelectDropdown'
import { SearchSelectClearButton } from './SearchSelectClearButton'

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
          <SearchSelectClearButton onClear={handleClear} />
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
