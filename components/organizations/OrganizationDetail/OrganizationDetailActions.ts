export interface OrganizationDetailActions {
  setIsEditing: (v: boolean) => void
  setEditName: (v: string) => void
  setEditDescription: (v: string) => void
  setEditSlug: (v: string) => void
  setShowDeleteConfirm: (v: boolean) => void
  setDeleteError: (v: string | null) => void
  handleSave: () => Promise<void>
  handleDelete: () => Promise<void>
  handleCancelEdit: () => void
}
