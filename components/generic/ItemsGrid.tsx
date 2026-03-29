import { GenericItemCard } from './GenericItemCard'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface ItemsGridProps {
  items: GenericItem[]
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  error: string | null
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onSoftDeleteConfirm: (id: string) => void
  onHardDeleteConfirm: (id: string) => void
}

export function ItemsGrid({
  items,
  config,
  itemType,
  singularName,
  error,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onSoftDeleteConfirm,
  onHardDeleteConfirm,
}: ItemsGridProps): React.JSX.Element {
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
            onSoftDeleteConfirm={onSoftDeleteConfirm}
            onHardDeleteConfirm={onHardDeleteConfirm}
          />
        ))}
      </div>
    </>
  )
}
