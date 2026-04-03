import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'

interface ItemCardContentProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
  itemType: string
  createLink: (path: string) => RouteLiteral
}

export function ItemCardContent({
  item,
  config,
  itemType,
  createLink,
}: ItemCardContentProps): React.JSX.Element {
  const meta = item.metadata
  const customFields = meta ? meta.customFields : {}
  return (
    <div className="generic-item-card-content">
      <Link
        href={createLink(`/${itemType}/${item.id}`)}
        className="generic-item-link"
      >
        <h3 className="generic-item-title">{item.title || item.id}</h3>
      </Link>
      <span className="generic-item-id" title={item.id}>
        {item.id}
      </span>
      {config &&
        config.features &&
        config.features.status &&
        meta &&
        meta.status && (
          <span className="generic-item-status">{meta.status}</span>
        )}
      {config && config.customFields.length > 0 && (
        <div className="generic-item-custom-fields">
          {config.customFields.slice(0, 2).map(field => {
            const value = customFields[field.name]
            if (!value) return null
            return (
              <span key={field.name} className="generic-item-field">
                <span className="field-label">{field.name}:</span>{' '}
                <span className="field-value" title={value}>
                  {value}
                </span>
              </span>
            )
          })}
        </div>
      )}
      {meta && meta.updatedAt && (
        <div className="generic-item-meta">
          <span className="generic-item-date">
            Updated: {new Date(meta.updatedAt).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  )
}
