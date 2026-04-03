import type { ReactNode } from 'react'
import { getPriorityClass } from './getPriorityClass'

function toDisplayLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

function derivePriorityLabel(priority: number): string {
  if (priority === 1) return 'High'
  if (priority === 2) return 'Medium'
  if (priority === 3) return 'Low'
  return ''
}

interface ItemMetadataProps {
  /** Custom status rendering (e.g., interactive dropdown). Overrides `status`. */
  statusNode?: ReactNode
  /** Plain-text status — rendered as a status-badge when no statusNode is provided. */
  status?: string
  /** Numeric priority: 1 = High, 2 = Medium, 3 = Low. */
  priority?: number
  /** Override the label derived from `priority`. Falls back to deriving from `priority`. */
  priorityLabel?: string
  /** ISO timestamp string for creation date. */
  createdAt?: string
  /** ISO timestamp string for last-updated date. */
  updatedAt?: string
  /** Custom field values keyed by field name. */
  customFields?: Record<string, string>
  /** Config entries that define which custom fields to display and in what order. */
  customFieldsConfig?: { name: string }[]
  /**
   * Content rendered first inside the metadata strip — useful for
   * item-type-specific leading badges (e.g., "Org Issue #5", "ID: abc").
   */
  children?: ReactNode
}

export function ItemMetadata({
  statusNode,
  status,
  priority,
  priorityLabel,
  createdAt,
  updatedAt,
  customFields,
  customFieldsConfig,
  children,
}: ItemMetadataProps) {
  const resolvedPriorityLabel =
    priorityLabel || (priority ? derivePriorityLabel(priority) : '')

  return (
    <div className="item-metadata">
      {children}
      {statusNode}
      {!statusNode && status && <span className="status-badge">{status}</span>}
      {resolvedPriorityLabel && (
        <span
          className={`priority-badge ${getPriorityClass(resolvedPriorityLabel)}`}
        >
          {resolvedPriorityLabel}
        </span>
      )}
      {customFieldsConfig &&
        customFieldsConfig.map(field => {
          const value = customFields && customFields[field.name]
          if (!value) return null
          return (
            <span key={field.name} className="item-field">
              <span className="field-label">{toDisplayLabel(field.name)}:</span>
              <span className="field-value">{value}</span>
            </span>
          )
        })}
      {createdAt && (
        <span className="item-date">
          Created: {new Date(createdAt).toLocaleString()}
        </span>
      )}
      {updatedAt && (
        <span className="item-date">
          Updated: {new Date(updatedAt).toLocaleString()}
        </span>
      )}
    </div>
  )
}
