export interface DuplicateModalProps {
  entityType: 'issue' | 'doc'
  entityId: string
  entityTitle: string
  entitySlug?: string
  currentProjectPath: string
  onClose: () => void
  onDuplicated: (newEntityId: string, targetProjectPath: string) => void
}
