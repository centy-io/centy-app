'use client'

import Link from 'next/link'

export function OrgsEmptyState() {
  return (
    <div className="empty-state">
      <p>No organizations found</p>
      <p>
        <Link href="/organizations/new">Create your first organization</Link> to
        group your projects
      </p>
    </div>
  )
}
