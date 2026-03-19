import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

interface GenericListHeaderProps {
  displayName: string
  singularName: string
  loading: boolean
  createNewUrl: RouteLiteral
  onRefresh: () => void
}

export function GenericListHeader({
  displayName,
  singularName,
  loading,
  createNewUrl,
  onRefresh,
}: GenericListHeaderProps) {
  const capSingular =
    singularName.charAt(0).toUpperCase() + singularName.slice(1)

  return (
    <div className="generic-list-header">
      <h2 className="generic-list-title">{displayName}</h2>
      <div className="header-actions">
        <button onClick={onRefresh} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <Link href={createNewUrl} className="create-btn">
          + New {capSingular}
        </Link>
      </div>
    </div>
  )
}
