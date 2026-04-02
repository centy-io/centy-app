import { useState } from 'react'
import { DeleteConfirmOverlay } from './DeleteConfirmOverlay'
import { ItemCardContent } from './ItemCardContent'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'

interface GenericItemCardProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onSoftDeleteConfirm: (id: string) => void
  onHardDeleteConfirm: (id: string) => void
}

export function GenericItemCard({
  item,
  config,
  itemType,
  singularName,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onSoftDeleteConfirm,
  onHardDeleteConfirm,
}: GenericItemCardProps): React.JSX.Element {
  const { createLink } = useAppLink()
  const [permanentStep, setPermanentStep] = useState(false)

  const handleCancel = (): void => {
    setPermanentStep(false)
    onDeleteCancel()
  }

  return (
    <div className="generic-item-card context-menu-row">
      <ItemCardContent
        item={item}
        config={config}
        itemType={itemType}
        createLink={createLink}
      />
      <button
        className="generic-item-delete-btn"
        onClick={e => {
          e.preventDefault()
          onDeleteRequest(item.id)
        }}
        title={`Delete ${singularName}`}
      >
        x
      </button>
      {deleteConfirm === item.id && (
        <div className="delete-confirm-overlay">
          <DeleteConfirmOverlay
            item={item}
            deleting={deleting}
            permanentStep={permanentStep}
            setPermanentStep={setPermanentStep}
            onCancel={handleCancel}
            onSoftDelete={onSoftDeleteConfirm}
            onHardDelete={onHardDeleteConfirm}
          />
        </div>
      )}
    </div>
  )
}
