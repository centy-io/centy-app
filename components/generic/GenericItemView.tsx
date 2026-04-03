import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { ItemMetadata } from '@/components/shared/ItemMetadata'
import { ItemTitle } from '@/components/shared/ItemView'

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
      <ItemTitle>{item.title || item.id}</ItemTitle>
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
      <TextEditor
        value={item.body}
        format="md"
        mode="display"
        className="generic-item-body"
      />
    </div>
  )
}
