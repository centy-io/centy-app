import type { ReactElement } from 'react'
import { CustomFieldMoveButtons } from './CustomFieldMoveButtons'
import { FIELD_TYPES } from './constants'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface CustomFieldDisplayProps {
  field: CustomFieldDefinition
  index: number
  totalCount: number
  onEdit: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function getTypeLabel(fieldType: string): string {
  const found = FIELD_TYPES.find(t => t.value === fieldType)
  return found ? found.label : fieldType
}

export function CustomFieldDisplay({
  field,
  index,
  totalCount,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: CustomFieldDisplayProps): ReactElement {
  return (
    <div className="custom-field-display">
      <div className="custom-field-header">
        <CustomFieldMoveButtons
          index={index}
          totalCount={totalCount}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
        <span className="custom-field-name">{field.name}</span>
        {field.required && <span className="custom-field-required">*</span>}
        <span className="custom-field-type">
          {getTypeLabel(field.fieldType)}
        </span>
        <div className="custom-field-actions">
          <button
            type="button"
            onClick={onEdit}
            className="custom-field-edit-btn"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="custom-field-remove-btn"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="custom-field-details">
        {field.defaultValue && (
          <span className="custom-field-default">
            Default:{' '}
            <code className="custom-field-default-value">
              {field.defaultValue}
            </code>
          </span>
        )}
        {field.fieldType === 'enum' && field.enumValues.length > 0 && (
          <span className="custom-field-enum-values">
            Options:{' '}
            {field.enumValues.map((v, i) => (
              <code className="custom-field-enum-value" key={v}>
                {v}
                {i < field.enumValues.length - 1 ? ', ' : ''}
              </code>
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
