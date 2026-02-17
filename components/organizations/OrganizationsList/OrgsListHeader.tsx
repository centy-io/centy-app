'use client'

import Link from 'next/link'

interface OrgsListHeaderProps {
  loading: boolean
  onRefresh: () => void
}

export function OrgsListHeader(props: OrgsListHeaderProps) {
  const { loading, onRefresh } = props
  return (
    <div className="organizations-header">
      <h2>Organizations</h2>
      <div className="header-actions">
        <button onClick={onRefresh} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <Link href="/organizations/new" className="create-btn">
          + New Organization
        </Link>
      </div>
    </div>
  )
}
