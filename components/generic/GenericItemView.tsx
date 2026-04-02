import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { ItemMetadata } from '@/components/shared/ItemMetadata'

interface GenericItemViewProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
}

export function GenericItemView({ item, config }: GenericItemViewProps) {
  const meta = item.metadata
  const customFields = meta ? meta.customFields : {}
  const showStatus = Boolean(
    config && config.features && config.features.status && meta && meta.status
  )

  return (
    <div className="generic-item-view">
      <h1 className="generic-item-view-title">{item.title || item.id}</h1>
      <ItemMetadata
        status={showStatus && meta ? meta.status : undefined}
        customFields={customFields}
        customFieldsConfig={config ? config.customFields : undefined}
        createdAt={meta ? meta.createdAt : undefined}
        updatedAt={meta ? meta.updatedAt : undefined}
      >
        <span className="generic-item-id-display">
          <span className="field-label">ID:</span> {item.id}
        </span>
      </ItemMetadata>
      {item.body && (
        <div className="generic-item-body">
          <TextEditor value={item.body} format="md" mode="display" />
        </div>
      )}
    </div>
  )
}
