export interface EditStateSlice {
  isEditing: boolean
  editTitle: string
  setEditTitle: (v: string) => void
  editDescription: string
  setEditDescription: (v: string) => void
  editStatus: string
  setEditStatus: (v: string) => void
  editPriority: number
  setEditPriority: (v: number) => void
  assignees: string[]
  setAssignees: (v: string[]) => void
}
