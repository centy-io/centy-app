import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Doc } from '@/gen/centy_pb'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'
import type {
  ContextMenuState,
  UseDocsContextMenuReturn,
} from '../DocsList.types'

export function useDocsContextMenu(
  projectPath: string,
  fetchDocs: () => Promise<void>
): UseDocsContextMenuReturn {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()

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

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        const url = createProjectLink(
          result.orgSlug,
          result.projectName,
          'docs'
        )
        router.push(url)
      } else {
        router.push('/')
      }
    },
    [resolvePathToUrl, createProjectLink, router]
  )

  const handleDuplicated = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        fetchDocs()
        router.push(createLink(`/docs/${newSlug}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          const url = createProjectLink(
            result.orgSlug,
            result.projectName,
            `docs/${newSlug}`
          )
          router.push(url)
        } else {
          router.push('/')
        }
      }
      setShowDuplicateModal(false)
      setSelectedDoc(null)
    },
    [
      projectPath,
      router,
      fetchDocs,
      createLink,
      resolvePathToUrl,
      createProjectLink,
    ]
  )

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
