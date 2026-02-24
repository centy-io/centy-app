import { FIELD_TYPES } from './constants'
import { MoveButtons } from './MoveButtons'
import { FieldDetails } from './FieldDetails'
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
}: CustomFieldDisplayProps) {
  const typeLabel = getTypeLabel(field.fieldType)

  return (
    <div className="custom-field-display">
      <div className="custom-field-header">
        <MoveButtons
          index={index}
          totalCount={totalCount}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
        <span className="custom-field-name">{field.name}</span>
        {field.required && <span className="custom-field-required">*</span>}
        <span className="custom-field-type">{typeLabel}</span>
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
      <FieldDetails field={field} />
    </div>
  )
}
