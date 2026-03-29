import type { Organization, ProjectInfo } from '@/gen/centy_pb'

export interface OrganizationDetailViewProps {
  organization: Organization
  projects: ProjectInfo[]
  error: string | null
  isEditing: boolean
  editName: string
  editDescription: string
  editSlug: string
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  deleteError: string | null
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
