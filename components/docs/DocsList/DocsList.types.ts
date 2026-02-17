import type { Dispatch, SetStateAction } from 'react'
import type { Doc } from '@/gen/centy_pb'

export interface ContextMenuState {
  x: number
  y: number
  doc: Doc
}

export interface UseDocsDataReturn {
  docs: Doc[]
  loading: boolean
  error: string | null
  deleteConfirm: string | null
  deleting: boolean
  setDeleteConfirm: Dispatch<SetStateAction<string | null>>
  fetchDocs: () => Promise<void>
  handleDelete: (slug: string) => Promise<void>
}

export interface UseDocsContextMenuReturn {
  contextMenu: ContextMenuState | null
  setContextMenu: Dispatch<SetStateAction<ContextMenuState | null>>
  showMoveModal: boolean
  showDuplicateModal: boolean
  selectedDoc: Doc | null
  setShowMoveModal: Dispatch<SetStateAction<boolean>>
  setShowDuplicateModal: Dispatch<SetStateAction<boolean>>
  setSelectedDoc: Dispatch<SetStateAction<Doc | null>>
  handleContextMenu: (e: React.MouseEvent, doc: Doc) => void
  handleMoveDoc: (doc: Doc) => void
  handleDuplicateDoc: (doc: Doc) => void
  handleMoved: (targetProjectPath: string) => Promise<void>
  handleDuplicated: (
    newSlug: string,
    targetProjectPath: string
  ) => Promise<void>
  closeMoveModal: () => void
  closeDuplicateModal: () => void
}
