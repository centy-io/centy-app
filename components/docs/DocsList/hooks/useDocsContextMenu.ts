import { useState, useCallback } from 'react'
import type { Doc } from '@/gen/centy_pb'
import type {
  ContextMenuState,
  UseDocsContextMenuReturn,
} from '../DocsList.types'
import { useDocNavigation } from './docsContextMenuHandlers'

export function useDocsContextMenu(
  projectPath: string,
  fetchDocs: () => Promise<void>
): UseDocsContextMenuReturn {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)

  const { handleMoved, handleDuplicated } = useDocNavigation({
    projectPath,
    fetchDocs,
    setShowDuplicateModal,
    setSelectedDoc,
  })

  const handleContextMenu = useCallback((e: React.MouseEvent, doc: Doc) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, doc })
  }, [])

  const handleMoveDoc = useCallback((doc: Doc) => {
    setSelectedDoc(doc)
    setShowMoveModal(true)
    setContextMenu(null)
  }, [])

  const handleDuplicateDoc = useCallback((doc: Doc) => {
    setSelectedDoc(doc)
    setShowDuplicateModal(true)
    setContextMenu(null)
  }, [])

  const closeMoveModal = useCallback(() => {
    setShowMoveModal(false)
    setSelectedDoc(null)
  }, [])

  const closeDuplicateModal = useCallback(() => {
    setShowDuplicateModal(false)
    setSelectedDoc(null)
  }, [])

  return {
    contextMenu,
    setContextMenu,
    showMoveModal,
    showDuplicateModal,
    selectedDoc,
    setShowMoveModal,
    setShowDuplicateModal,
    setSelectedDoc,
    handleContextMenu,
    handleMoveDoc,
    handleDuplicateDoc,
    handleMoved,
    handleDuplicated,
    closeMoveModal,
    closeDuplicateModal,
  }
}
