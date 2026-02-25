import Link from 'next/link'
import { GenericItemCard } from './GenericItemCard'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface GenericListContentProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  error: string | null
  items: GenericItem[]
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  displayName: string
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onDeleteConfirm: (id: string) => void
}

// eslint-disable-next-line max-lines-per-function
export function GenericListContent({
  projectPath,
  isInitialized,
  loading,
  error,
  items,
  config,
  itemType,
  singularName,
  displayName,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
}: GenericListContentProps) {
  const { createLink } = useAppLink()
  const capSingular =
    singularName.charAt(0).toUpperCase() + singularName.slice(1)

  if (!projectPath) {
    return (
      <div className="no-project-message">
        <p className="no-project-text">
          Select a project from the header to view {displayName.toLowerCase()}
        </p>
      </div>
    )
  }
  if (isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p className="not-initialized-text">
          Centy is not initialized in this directory
        </p>
      </div>
    )
  }
  if (isInitialized !== true) return null
  if (loading && items.length === 0) {
    return <div className="loading">Loading {displayName.toLowerCase()}...</div>
  }
  if (items.length === 0) {
    return (
      <div className="empty-state">
        {error && <DaemonErrorMessage error={error} />}
        <p className="empty-state-text">No {displayName.toLowerCase()} found</p>
        <Link href={createLink(`/${itemType}/new`)}>
          Create your first {capSingular}
        </Link>
      </div>
    )
  }
  return (
    <>
      {error && <DaemonErrorMessage error={error} />}
      <div className="generic-items-grid">
        {items.map(item => (
          <GenericItemCard
            key={item.id}
            item={item}
            config={config}
            itemType={itemType}
            singularName={singularName}
            deleteConfirm={deleteConfirm}
            deleting={deleting}
            onDeleteRequest={onDeleteRequest}
            onDeleteCancel={onDeleteCancel}
            onDeleteConfirm={onDeleteConfirm}
          />
        ))}
      </div>
    </>
  )
}
