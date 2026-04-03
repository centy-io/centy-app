'use client'

import type { RefObject, KeyboardEvent } from 'react'

interface ProjectSelectorSearchProps {
  searchQuery: string
  setSearchQuery: (v: string) => void
  searchInputRef: RefObject<HTMLInputElement | null>
}

export function ProjectSelectorSearch({
  searchQuery,
  setSearchQuery,
  searchInputRef,
}: ProjectSelectorSearchProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowDown') return
    e.preventDefault()
    const firstItem = document.querySelector<HTMLElement>(
      '#project-listbox [role="option"]'
    )
    if (firstItem) firstItem.focus()
  }

  return (
    <div className="project-selector-search">
      <input
        ref={searchInputRef}
        role="combobox"
        aria-expanded="true"
        aria-controls="project-listbox"
        aria-autocomplete="list"
        aria-label="Search projects"
        type="text"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search projects..."
        className="search-input"
      />
      {searchQuery && (
        <button
          className="search-clear-btn"
          onClick={() => {
            setSearchQuery('')
          }}
          title="Clear search"
        >
          {'\u00D7'}
        </button>
      )}
    </div>
  )
}
