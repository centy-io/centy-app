import type { Organization, ProjectInfo } from '@/gen/centy_pb'

export interface OrganizationDetailViewProps {
  organization: Organization
  projects: ProjectInfo[]
  error: string | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  editName: string
  setEditName: (v: string) => void
  editDescription: string
  setEditDescription: (v: string) => void
  editSlug: string
  setEditSlug: (v: string) => void
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  deleteError: string | null
  setDeleteError: (v: string | null) => void
  handleSave: () => void
  handleDelete: () => void
  handleCancelEdit: () => void
}
