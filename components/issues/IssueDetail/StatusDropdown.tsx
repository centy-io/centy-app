'use client'

import type { ReactElement, RefObject } from 'react'
import type { Issue } from '@/gen/centy_pb'

interface StateOption {
  value: string
  label: string
}

interface StatusDropdownProps {
  issue: Issue
  stateManager: {
    getStateClass: (status: string) => string
  }
  stateOptions: StateOption[]
  showStatusDropdown: boolean
  updatingStatus: boolean
  statusDropdownRef: RefObject<HTMLDivElement | null>
  onToggleDropdown: () => void
  onStatusChange: (status: string) => void
}

export function StatusDropdown({
  issue,
  stateManager,
  stateOptions,
  showStatusDropdown,
  updatingStatus,
  statusDropdownRef,
  onToggleDropdown,
  onStatusChange,
}: StatusDropdownProps): ReactElement {
  const currentStatus = (issue.metadata && issue.metadata.status) || ''
  return (
    <div className="status-selector" ref={statusDropdownRef}>
      <button
        className={`status-badge status-badge-clickable ${stateManager.getStateClass(currentStatus)} ${updatingStatus ? 'updating' : ''}`}
        onClick={onToggleDropdown}
        disabled={updatingStatus}
        aria-label="Change status"
        aria-expanded={showStatusDropdown}
        aria-haspopup="listbox"
      >
        {updatingStatus ? 'Updating...' : currentStatus || 'unknown'}
        <span className="status-dropdown-arrow" aria-hidden="true">
          &#9660;
        </span>
      </button>
      {showStatusDropdown && (
        <ul
          className="status-dropdown"
          role="listbox"
          aria-label="Status options"
        >
          {stateOptions.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === currentStatus}
              className={`status-option ${stateManager.getStateClass(option.value)} ${option.value === currentStatus ? 'selected' : ''}`}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
