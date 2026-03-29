'use client'

import type { CustomFieldDefinition } from '@/gen/centy_pb'

export function useFieldListActions(
  fields: CustomFieldDefinition[],
  onChange: (fields: CustomFieldDefinition[]) => void
) {
  const handleAdd = (field: CustomFieldDefinition): void => {
    onChange([...fields, field])
  }

  const handleUpdate = (index: number, field: CustomFieldDefinition): void => {
    const newFields = [...fields]
    newFields.splice(index, 1, field)
    onChange(newFields)
  }

  const handleRemove = (index: number): void => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const handleMoveUp = (index: number): void => {
    if (index === 0) return
    const newFields = [...fields]
    const curr = newFields.at(index)
    if (curr === undefined) return
    newFields.splice(index - 1, 2, curr, newFields[index - 1])
    onChange(newFields)
  }

  const handleMoveDown = (index: number): void => {
    if (index === fields.length - 1) return
    const newFields = [...fields]
    const curr = newFields.at(index)
    if (curr === undefined) return
    newFields.splice(index, 2, newFields[index + 1], curr)
    onChange(newFields)
  }

  return { handleAdd, handleUpdate, handleRemove, handleMoveUp, handleMoveDown }
}
