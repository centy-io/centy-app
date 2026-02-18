import { useState } from 'react'
import { EnumValuesEditor } from './EnumValuesEditor'
import { DefaultValueField } from './DefaultValueField'
import { CustomFieldFormFields } from './CustomFieldFormFields'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface CustomFieldFormProps {
  field?: CustomFieldDefinition
  existingNames: string[]
  onSave: (field: CustomFieldDefinition) => void
  onCancel: () => void
}

// eslint-disable-next-line max-lines-per-function
export function CustomFieldForm({
  field,
  existingNames,
  onSave,
  onCancel,
}: CustomFieldFormProps) {
  const [name, setName] = useState(field ? field.name : '')
  const [fieldType, setFieldType] = useState(field ? field.fieldType : 'string')
  const [required, setRequired] = useState(field ? field.required : false)
  const [defaultValue, setDefaultValue] = useState(
    field ? field.defaultValue : ''
  )
  const [enumValues, setEnumValues] = useState<string[]>(
    field ? field.enumValues : []
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

  const handleRemoveEnumValue = (value: string) => {
    setEnumValues(enumValues.filter(v => v !== value))
    if (defaultValue === value) {
      setDefaultValue('')
    }
  }

  return (
    <div className="custom-field-form">
      <CustomFieldFormFields
        name={name}
        fieldType={fieldType}
        required={required}
        onNameChange={setName}
        onFieldTypeChange={setFieldType}
        onRequiredChange={setRequired}
      />

      {fieldType === 'enum' && (
        <EnumValuesEditor
          enumValues={enumValues}
          onAdd={value => setEnumValues([...enumValues, value])}
          onRemove={handleRemoveEnumValue}
        />
      )}

      <DefaultValueField
        fieldType={fieldType}
        defaultValue={defaultValue}
        enumValues={enumValues}
        onChange={setDefaultValue}
      />

      <div className="custom-field-form-actions">
        <button type="button" onClick={onCancel} className="secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className="primary"
        >
          {field ? 'Update' : 'Add'} Field
        </button>
      </div>
    </div>
  )
}
