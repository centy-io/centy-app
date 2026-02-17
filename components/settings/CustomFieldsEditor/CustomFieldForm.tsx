'use client'

import { useState } from 'react'
import {
  FIELD_TYPES,
  type CustomFieldFormProps,
} from './CustomFieldsEditor.types'
import { EnumValuesEditor } from './EnumValuesEditor'
import { DefaultValueField } from './DefaultValueField'
import { CustomFieldFormActions } from './CustomFieldFormActions'

export function CustomFieldForm({
  field,
  existingNames,
  onSave,
  onCancel,
}: CustomFieldFormProps) {
  const [name, setName] = useState(field?.name || '')
  const [fieldType, setFieldType] = useState(field?.fieldType || 'string')
  const [required, setRequired] = useState(field?.required || false)
  const [defaultValue, setDefaultValue] = useState(field?.defaultValue || '')
  const [enumValues, setEnumValues] = useState<string[]>(
    field?.enumValues || []
  )

  const isValid =
    name.trim() &&
    !existingNames.includes(name.trim()) &&
    (fieldType !== 'enum' || enumValues.length > 0)

  const handleSave = () => {
    if (!isValid) return
    onSave({
      name: name.trim(),
      fieldType,
      required,
      defaultValue: defaultValue || '',
      enumValues: fieldType === 'enum' ? enumValues : [],
      $typeName: 'centy.v1.CustomFieldDefinition',
    })
  }

  return (
    <div className="custom-field-form">
      <div className="custom-field-form-row">
        <div className="custom-field-form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="field_name"
            className="custom-field-form-input"
          />
        </div>

        <div className="custom-field-form-group">
          <label>Type</label>
          <select
            value={fieldType}
            onChange={e => setFieldType(e.target.value)}
            className="custom-field-form-select"
          >
            {FIELD_TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="custom-field-form-group custom-field-form-checkbox">
          <label>
            <input
              type="checkbox"
              checked={required}
              onChange={e => setRequired(e.target.checked)}
            />
            Required
          </label>
        </div>
      </div>

      {fieldType === 'enum' && (
        <EnumValuesEditor
          enumValues={enumValues}
          onEnumValuesChange={setEnumValues}
          onDefaultCleared={() => setDefaultValue('')}
          defaultValue={defaultValue}
        />
      )}

      <DefaultValueField
        fieldType={fieldType}
        defaultValue={defaultValue}
        enumValues={enumValues}
        onDefaultValueChange={setDefaultValue}
      />

      <CustomFieldFormActions
        isEditing={!!field}
        isValid={!!isValid}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  )
}
