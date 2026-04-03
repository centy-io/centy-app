import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useLinkRoutes } from './useLinkRoutes'
import { deleteLinkRequest } from './deleteLinkRequest'
import { removeLinkFromList } from './removeLinkFromList'
import { centyClient } from '@/lib/grpc/client'
import { ListLinksRequestSchema, type Link as LinkType } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function useLinkSection(entityId: string, entityType: 'issue' | 'doc') {
  const { projectPath } = usePathContext()
  const { buildLinkRoute } = useLinkRoutes()
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)

  const fetchLinks = useCallback(async () => {
    if (!projectPath || !entityId) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListLinksRequestSchema, {
        projectPath,
        entityId,
        entityItemType: entityType,
      })
      const response = await centyClient.listLinks(request)
      setLinks(response.links)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [projectPath, entityId, entityType])

  useEffect(() => {
    void fetchLinks()
  }, [fetchLinks])

  const handleDeleteLink = useCallback(
    async (link: LinkType) => {
      if (!projectPath || !entityId) return
      setDeletingLinkId(`${link.targetId}-${link.linkType}`)
      setError(null)
      try {
        const result = await deleteLinkRequest(projectPath, link)
        if (result.success) {
          setLinks(prev => removeLinkFromList(prev, link))
        } else {
          setError(result.error ?? 'Failed to delete link')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete link')
      } finally {
        setDeletingLinkId(null)
      }
    },
    [projectPath, entityId]
  )

  const handleLinkCreated = useCallback(() => {
    void fetchLinks()
    setShowAddModal(false)
  }, [fetchLinks])

  return {
    links,
    loading,
    error,
    showAddModal,
    setShowAddModal,
    deletingLinkId,
    buildLinkRoute,
    handleDeleteLink,
    handleLinkCreated,
  }
}
