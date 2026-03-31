import { useState } from 'react'
import type { CustomFieldDefinition } from '@/gen/centy_pb'

export function useCustomFieldFormState(
  field: CustomFieldDefinition | undefined
) {
  const [name, setName] = useState(field ? field.name : '')
  const [fieldType, setFieldType] = useState(field ? field.fieldType : 'string')
  const [required, setRequired] = useState(field ? field.required : false)
  const [defaultValue, setDefaultValue] = useState(
    field ? field.defaultValue : ''
  )
  const [enumValues, setEnumValues] = useState<string[]>(
    field ? field.enumValues : []
  )

  const handleRemoveEnumValue = (value: string): void => {
    setEnumValues(enumValues.filter(v => v !== value))
    if (defaultValue === value) setDefaultValue('')
  }

  return {
    name,
    setName,
    fieldType,
    setFieldType,
    required,
    setRequired,
    defaultValue,
    setDefaultValue,
    enumValues,
    setEnumValues,
    handleRemoveEnumValue,
  }
}
