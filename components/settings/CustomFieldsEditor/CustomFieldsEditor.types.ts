import type { CustomFieldDefinition } from '@/gen/centy_pb'

export interface CustomFieldsEditorProps {
  fields: CustomFieldDefinition[]
  onChange: (fields: CustomFieldDefinition[]) => void
}

export interface CustomFieldDisplayProps {
  field: CustomFieldDefinition
  index: number
  totalCount: number
  onEdit: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export interface CustomFieldFormProps {
  field?: CustomFieldDefinition
  existingNames: string[]
  onSave: (field: CustomFieldDefinition) => void
  onCancel: () => void
}

export const FIELD_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox' },
  { value: 'enum', label: 'Select (Enum)' },
]
