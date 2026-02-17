export interface MoveModalProps {
  entityType: 'issue' | 'doc'
  entityId: string
  entityTitle: string
  currentProjectPath: string
  onClose: () => void
  onMoved: (targetProjectPath: string, newEntityId?: string) => void
}
