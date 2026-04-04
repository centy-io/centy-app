export interface MoveModalProps {
  entityType: string
  entityId: string
  entityTitle: string
  currentProjectPath: string
  onClose: () => void
  onMoved: (targetProjectPath: string, newEntityId?: string) => void
}
