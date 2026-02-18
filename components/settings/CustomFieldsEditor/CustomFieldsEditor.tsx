'use client'

import { useState } from 'react'
import type { CustomFieldDefinition } from '@/gen/centy_pb'
import { CustomFieldForm } from './CustomFieldForm'
import { CustomFieldDisplay } from './CustomFieldDisplay'

interface CustomFieldsEditorProps {
  fields: CustomFieldDefinition[]
  onChange: (fields: CustomFieldDefinition[]) => void
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
    newFields[index] = field
    onChange(newFields)
    setEditingIndex(null)
  }

  const handleRemove = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newFields = [...fields]
    ;[newFields[index - 1], newFields[index]] = [
      newFields[index],
      newFields[index - 1],
    ]
    onChange(newFields)
  }

  const handleMoveDown = (index: number) => {
    if (index === fields.length - 1) return
    const newFields = [...fields]
    ;[newFields[index], newFields[index + 1]] = [
      newFields[index + 1],
      newFields[index],
    ]
    onChange(newFields)
  }

  return (
    <div className="custom-fields-editor">
      {fields.length > 0 && (
        <div className="custom-fields-list">
          {fields.map((field, index) => (
            <div key={field.name} className="custom-field-item">
              {editingIndex === index ? (
                <CustomFieldForm
                  field={field}
                  existingNames={fields
                    .filter((_, i) => i !== index)
                    .map(f => f.name)}
                  onSave={f => handleUpdate(index, f)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <CustomFieldDisplay
                  field={field}
                  index={index}
                  totalCount={fields.length}
                  onEdit={() => setEditingIndex(index)}
                  onRemove={() => handleRemove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              )}
            </div>
          ))}
        </div>
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
