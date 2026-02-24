'use client'

import { CustomFieldForm } from './CustomFieldForm'
import { CustomFieldDisplay } from './CustomFieldDisplay'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface FieldsListProps {
  fields: CustomFieldDefinition[]
  editingIndex: number | null
  onEdit: (index: number) => void
  onUpdate: (index: number, field: CustomFieldDefinition) => void
  onCancelEdit: () => void
  onRemove: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

export function FieldsList({
  fields,
  editingIndex,
  onEdit,
  onUpdate,
  onCancelEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: FieldsListProps) {
  return (
    <div className="custom-fields-list">
      {fields.map((field, index) => (
        <div key={field.name} className="custom-field-item">
          {editingIndex === index ? (
            <CustomFieldForm
              field={field}
              existingNames={fields
                .filter((_, i) => i !== index)
                .map(f => f.name)}
              onSave={f => onUpdate(index, f)}
              onCancel={onCancelEdit}
            />
          ) : (
            <CustomFieldDisplay
              field={field}
              index={index}
              totalCount={fields.length}
              onEdit={() => onEdit(index)}
              onRemove={() => onRemove(index)}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
