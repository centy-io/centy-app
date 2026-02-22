import type { Organization, ProjectInfo } from '@/gen/centy_pb'

export interface OrganizationDetailState {
  organization: Organization | null
  projects: ProjectInfo[]
  loading: boolean
  error: string | null
  isEditing: boolean
  editName: string
  editDescription: string
  editSlug: string
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  deleteError: string | null
}
