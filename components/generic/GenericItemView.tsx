import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'

interface GenericItemViewProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
}

function toDisplayLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

export function GenericItemView({ item, config }: GenericItemViewProps) {
  const meta = item.metadata
  const customFields = meta && meta.customFields ? meta.customFields : {}

  return (
    <div className="generic-item-view">
      <h1 className="generic-item-view-title">{item.title || item.id}</h1>
      <div className="generic-item-id-display">
        <span className="field-label">ID:</span> {item.id}
      </div>

      {config &&
        config.features &&
        config.features.status &&
        meta &&
        meta.status && (
          <div className="generic-item-status-display">
            <span className="field-label">Status:</span> {meta.status}
          </div>
        )}

      {config &&
        config.customFields &&
        config.customFields.map(field => {
          const value = customFields[field.name]
          if (!value) return null
          return (
            <div key={field.name} className="generic-item-field-display">
              <span className="field-label">{toDisplayLabel(field.name)}:</span>{' '}
              <span className="field-value">{value}</span>
            </div>
          )
        })}

      {item.body && (
        <div className="generic-item-body">
          <TextEditor value={item.body} format="md" mode="display" />
        </div>
      )}

      {meta && meta.updatedAt && (
        <div className="generic-item-meta">
          Updated: {new Date(meta.updatedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}
