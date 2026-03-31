'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'projects-desc', label: 'Most Projects' },
  { value: 'projects-asc', label: 'Fewest Projects' },
]

interface OrgListHeaderProps {
  loading: boolean
  onRefresh: () => void
  sortPreset: string
  onSortChange: (value: string) => void
}

export function OrgListHeader({
  loading,
  onRefresh,
  sortPreset,
  onSortChange,
}: OrgListHeaderProps): React.JSX.Element {
  return (
    <>
      <div className="organizations-header">
        <h2 className="organizations-title">Organizations</h2>
        <div className="header-actions">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <Link
            href={route({ pathname: '/organizations/new' })}
            className="create-btn"
          >
            + New Organization
          </Link>
        </div>
      </div>
      <div className="organizations-toolbar">
        <div className="sort-control">
          <label className="sort-label" htmlFor="orgs-sort-select">
            Sort by
          </label>
          <select
            id="orgs-sort-select"
            className="sort-select"
            value={sortPreset}
            onChange={e => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="sort-option">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
