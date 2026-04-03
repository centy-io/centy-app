import type { ReactElement } from 'react'
import { useCustomFieldFormState } from './useCustomFieldFormState'
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

export function CustomFieldForm({
  field,
  existingNames,
  onSave,
  onCancel,
}: CustomFieldFormProps): ReactElement {
  const state = useCustomFieldFormState(field)
  const { name, fieldType, required, defaultValue, enumValues } = state

  const isValid =
    name.trim() &&
    !existingNames.includes(name.trim()) &&
    (fieldType !== 'enum' || enumValues.length > 0)

  const handleSave = (): void => {
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
      <CustomFieldFormFields
        name={name}
        fieldType={fieldType}
        required={required}
        onNameChange={state.setName}
        onFieldTypeChange={state.setFieldType}
        onRequiredChange={state.setRequired}
      />
      {fieldType === 'enum' && (
        <EnumValuesEditor
          enumValues={enumValues}
          onAdd={value => {
            state.setEnumValues([...enumValues, value])
          }}
          onRemove={state.handleRemoveEnumValue}
        />
      )}
      <DefaultValueField
        fieldType={fieldType}
        defaultValue={defaultValue}
        enumValues={enumValues}
        onChange={state.setDefaultValue}
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
