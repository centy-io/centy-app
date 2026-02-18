import type { Doc } from '@/gen/centy_pb'

export interface DocDetailProps {
  slug: string
}

export interface DocDetailState {
  doc: Doc | null
  loading: boolean
  error: string | null
  isEditing: boolean
  editTitle: string
  editContent: string
  editSlug: string
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  showMoveModal: boolean
  showDuplicateModal: boolean
}
