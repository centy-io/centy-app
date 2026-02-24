export interface EditState {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  editTitle: string
  setEditTitle: (title: string) => void
  editDescription: string
  setEditDescription: (description: string) => void
  editStatus: string
  setEditStatus: (status: string) => void
  editPriority: number
  setEditPriority: (priority: number) => void
  saving: boolean
  assignees: string[]
  setAssignees: (assignees: string[]) => void
}
