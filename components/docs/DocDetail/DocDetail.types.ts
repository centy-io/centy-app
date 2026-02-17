import type { Dispatch, SetStateAction } from 'react'
import type { RouteLiteral } from 'nextjs-routes'
import type { Doc } from '@/gen/centy_pb'

export interface DocDetailProps {
  slug: string
}

export interface UseDocActionsParams {
  projectPath: string
  slug: string
  editTitle: string
  editContent: string
  editSlug: string
  doc: Doc | null
  setDoc: Dispatch<SetStateAction<Doc | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setIsEditing: (value: boolean) => void
  setEditTitle: (value: string) => void
  setEditContent: (value: string) => void
  setEditSlug: (value: string) => void
  setShowDeleteConfirm: (value: boolean) => void
  docsListUrl: RouteLiteral
}

export interface UseDocDetailReturn {
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
  docsListUrl: RouteLiteral
  projectPath: string
  setIsEditing: (value: boolean) => void
  setEditTitle: (value: string) => void
  setEditContent: (value: string) => void
  setEditSlug: (value: string) => void
  setShowDeleteConfirm: (value: boolean) => void
  setShowMoveModal: (value: boolean) => void
  setShowDuplicateModal: (value: boolean) => void
  handleSave: () => Promise<void>
  handleDelete: () => Promise<void>
  handleCancelEdit: () => void
  handleMoved: (targetProjectPath: string) => Promise<void>
  handleDuplicated: (
    newSlug: string,
    targetProjectPath: string
  ) => Promise<void>
  copyToClipboard: (text: string, label: string) => void
}
