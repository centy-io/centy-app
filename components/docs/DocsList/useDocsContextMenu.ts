import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppLink } from '@/hooks/useAppLink'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import type { Doc } from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { ContextMenuState } from './types'

export function useDocsContextMenu() {
  const router = useRouter()
  const { createLink } = useAppLink()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)

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

  const contextMenuItems: ContextMenuItem[] = contextMenu
    ? [
        {
          label: isPinned(contextMenu.doc.slug) ? 'Unpin' : 'Pin',
          onClick: () => {
            if (isPinned(contextMenu.doc.slug)) {
              unpinItem(contextMenu.doc.slug)
            } else {
              pinItem({
                id: contextMenu.doc.slug,
                type: 'doc',
                title: contextMenu.doc.title,
              })
            }
            setContextMenu(null)
          },
        },
        {
          label: 'View',
          onClick: () => {
            router.push(createLink(`/docs/${contextMenu.doc.slug}`))
            setContextMenu(null)
          },
        },
        {
          label: 'Move',
          onClick: () => handleMoveDoc(contextMenu.doc),
        },
        {
          label: 'Duplicate',
          onClick: () => handleDuplicateDoc(contextMenu.doc),
        },
      ]
    : []

  return {
    contextMenu,
    setContextMenu,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    selectedDoc,
    setSelectedDoc,
    handleContextMenu,
    contextMenuItems,
  }
}
