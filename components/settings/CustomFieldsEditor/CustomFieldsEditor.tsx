'use client'

import { useState } from 'react'
import { FieldsList } from './FieldsList'
import { CustomFieldForm } from './CustomFieldForm'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface CustomFieldsEditorProps {
  fields: CustomFieldDefinition[]
  onChange: (fields: CustomFieldDefinition[]) => void
}

function moveFieldUp(
  fields: CustomFieldDefinition[],
  index: number
): CustomFieldDefinition[] {
  if (index === 0) return fields
  const newFields = [...fields]
  const curr = newFields.at(index)
  if (curr === undefined) return fields
  newFields.splice(index - 1, 2, curr, newFields[index - 1])
  return newFields
}

function moveFieldDown(
  fields: CustomFieldDefinition[],
  index: number
): CustomFieldDefinition[] {
  if (index === fields.length - 1) return fields
  const newFields = [...fields]
  const curr = newFields.at(index)
  if (curr === undefined) return fields
  newFields.splice(index, 2, newFields[index + 1], curr)
  return newFields
}

export function CustomFieldsEditor({
  fields,
  onChange,
}: CustomFieldsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = (field: CustomFieldDefinition) => {
    onChange([...fields, field])
    setIsAdding(false)
  }

  const handleUpdate = (index: number, field: CustomFieldDefinition) => {
    const newFields = [...fields]
    newFields.splice(index, 1, field)
    onChange(newFields)
    setEditingIndex(null)
  }

  return (
    <div className="custom-fields-editor">
      {fields.length > 0 && (
        <FieldsList
          fields={fields}
          editingIndex={editingIndex}
          onEdit={setEditingIndex}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingIndex(null)}
          onRemove={index => onChange(fields.filter((_, i) => i !== index))}
          onMoveUp={index => onChange(moveFieldUp(fields, index))}
          onMoveDown={index => onChange(moveFieldDown(fields, index))}
        />
      )}
      {isAdding ? (
        <div className="custom-field-item">
          <CustomFieldForm
            existingNames={fields.map(f => f.name)}
            onSave={handleAdd}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="custom-field-add-btn"
        >
          + Add Custom Field
        </button>
      )}
      {fields.length === 0 && !isAdding && (
        <p className="custom-fields-empty">No custom fields configured</p>
      )}
    </div>
  )
}
