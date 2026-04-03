'use client'

import { useState } from 'react'
import type { ReactElement } from 'react'
import { CustomFieldForm } from './CustomFieldForm'
import { CustomFieldDisplay } from './CustomFieldDisplay'
import { useFieldListActions } from './useFieldListActions'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface CustomFieldsEditorProps {
  fields: CustomFieldDefinition[]
  onChange: (fields: CustomFieldDefinition[]) => void
}

export function CustomFieldsEditor({
  fields,
  onChange,
}: CustomFieldsEditorProps): ReactElement {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const actions = useFieldListActions(fields, onChange)

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
                  onSave={f => {
                    actions.handleUpdate(index, f)
                    setEditingIndex(null)
                  }}
                  onCancel={() => {
                    setEditingIndex(null)
                  }}
                />
              ) : (
                <CustomFieldDisplay
                  field={field}
                  index={index}
                  totalCount={fields.length}
                  onEdit={() => {
                    setEditingIndex(index)
                  }}
                  onRemove={() => {
                    actions.handleRemove(index)
                  }}
                  onMoveUp={() => {
                    actions.handleMoveUp(index)
                  }}
                  onMoveDown={() => {
                    actions.handleMoveDown(index)
                  }}
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
            onSave={f => {
              actions.handleAdd(f)
              setIsAdding(false)
            }}
            onCancel={() => {
              setIsAdding(false)
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsAdding(true)
          }}
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
