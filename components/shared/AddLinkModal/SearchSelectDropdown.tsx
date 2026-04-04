import { useState, useRef, useEffect } from 'react'
import { getTargetTypeIcon } from '../LinkSection/linkHelpers'
import type { EntityItem } from './AddLinkModal.types'

interface DropdownProps {
  loadingSearch: boolean
  searchResults: EntityItem[]
  getEntityLabel: (item: EntityItem) => string
  onSelect: (item: EntityItem) => void
}

export function useDropdownOpen(
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

export function Dropdown({
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
            {getTargetTypeIcon(item.type)}
          </span>
          <span className="link-modal-item-label">{getEntityLabel(item)}</span>
        </li>
      ))}
    </ul>
  )
}
