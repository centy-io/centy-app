/* eslint-disable max-lines */
import { useState } from 'react'
import Link from 'next/link'
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

// eslint-disable-next-line max-lines-per-function
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
}: GenericItemCardProps) {
  const { createLink } = useAppLink()
  const [permanentStep, setPermanentStep] = useState(false)
  const meta = item.metadata
  const customFields = meta && meta.customFields ? meta.customFields : {}

  const handleCancel = () => {
    setPermanentStep(false)
    onDeleteCancel()
  }

  return (
    <div className="generic-item-card context-menu-row">
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
        {config && config.customFields && config.customFields.length > 0 && (
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
          {permanentStep ? (
            <>
              <p className="delete-confirm-message">
                Permanently delete &ldquo;{item.title || item.id}&rdquo;? This
                cannot be undone.
              </p>
              <div className="delete-confirm-actions">
                <button
                  onClick={() => setPermanentStep(false)}
                  className="cancel-btn"
                >
                  Go back
                </button>
                <button
                  onClick={() => onHardDeleteConfirm(item.id)}
                  disabled={deleting}
                  className="confirm-delete-btn"
                >
                  {deleting ? 'Deleting...' : 'Delete permanently'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="delete-confirm-message">
                Delete &ldquo;{item.title || item.id}&rdquo;?
              </p>
              <div className="delete-confirm-actions">
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={() => onSoftDeleteConfirm(item.id)}
                  disabled={deleting}
                  className="archive-btn"
                >
                  {deleting ? 'Archiving...' : 'Archive'}
                </button>
                <button
                  onClick={() => setPermanentStep(true)}
                  className="confirm-delete-btn"
                >
                  Delete permanently
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
