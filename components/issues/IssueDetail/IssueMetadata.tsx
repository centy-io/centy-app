import { useRef, useEffect } from 'react'
import type { Issue } from '@/gen/centy_pb'
import { useStateManager } from '@/lib/state'
import { StatusDropdown } from './StatusDropdown'
import { getPriorityClass } from './utils'

interface IssueMetadataProps {
  issue: Issue
  updatingStatus: boolean
  showStatusDropdown: boolean
  stateOptions: { value: string; label: string }[]
  onStatusDropdownToggle: () => void
  onStatusChange: (status: string) => void
}

export function IssueMetadata({
  issue,
  updatingStatus,
  showStatusDropdown,
  stateOptions,
  onStatusDropdownToggle,
  onStatusChange,
}: IssueMetadataProps) {
  const stateManager = useStateManager()
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        onStatusDropdownToggle()
      }
    }

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStatusDropdown, onStatusDropdownToggle])

  return (
    <div className="issue-metadata">
      <div className="status-selector" ref={statusDropdownRef}>
        <button
          className={`status-badge status-badge-clickable ${stateManager.getStateClass(issue.metadata?.status || '')} ${updatingStatus ? 'updating' : ''}`}
          onClick={onStatusDropdownToggle}
          disabled={updatingStatus}
          aria-label="Change status"
          aria-expanded={showStatusDropdown}
          aria-haspopup="listbox"
        >
          {updatingStatus ? 'Updating...' : issue.metadata?.status || 'unknown'}
          <span className="status-dropdown-arrow" aria-hidden="true">
            ▼
          </span>
        </button>
        {showStatusDropdown && (
          <StatusDropdown
            stateOptions={stateOptions}
            currentStatus={issue.metadata?.status}
            onStatusChange={onStatusChange}
          />
        )}
      </div>
      <span
        className={`priority-badge ${getPriorityClass(issue.metadata?.priorityLabel || '')}`}
      >
        {issue.metadata?.priorityLabel || 'unknown'}
      </span>
      <span className="issue-date">
        Created:{' '}
        {issue.metadata?.createdAt
          ? new Date(issue.metadata.createdAt).toLocaleString()
          : '-'}
      </span>
      {issue.metadata?.updatedAt && (
        <span className="issue-date">
          Updated: {new Date(issue.metadata.updatedAt).toLocaleString()}
        </span>
      )}
    </div>
  )
}
