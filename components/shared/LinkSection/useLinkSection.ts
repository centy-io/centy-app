import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useLinkRoutes } from './useLinkRoutes'
import { centyClient } from '@/lib/grpc/client'
import {
  ListLinksRequestSchema,
  DeleteLinkRequestSchema,
  LinkTargetType,
  type Link as LinkType,
} from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

function toProtoTargetType(entityType: 'issue' | 'doc') {
  return entityType === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}

function useFetchLinks(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  setLinks: React.Dispatch<React.SetStateAction<LinkType[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  return useCallback(async () => {
    if (!projectPath || !entityId) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListLinksRequestSchema, {
        projectPath,
        entityId,
        entityType: toProtoTargetType(entityType),
      })
      const response = await centyClient.listLinks(request)
      setLinks(response.links)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [projectPath, entityId, entityType, setLinks, setLoading, setError])
}

function useDeleteLink(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  setLinks: React.Dispatch<React.SetStateAction<LinkType[]>>,
  setDeletingLinkId: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  return useCallback(
    async (link: LinkType) => {
      if (!projectPath || !entityId) return
      setDeletingLinkId(`${link.targetId}-${link.linkType}`)
      setError(null)
      try {
        const request = create(DeleteLinkRequestSchema, {
          projectPath,
          sourceId: entityId,
          sourceType: toProtoTargetType(entityType),
          targetId: link.targetId,
          targetType: link.targetType,
          linkType: link.linkType,
        })
        const response = await centyClient.deleteLink(request)
        if (response.success) {
          setLinks(prev =>
            prev.filter(
              l =>
                !(l.targetId === link.targetId && l.linkType === link.linkType)
            )
          )
        } else {
          setError(response.error || 'Failed to delete link')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete link')
      } finally {
        setDeletingLinkId(null)
      }
    },
    [projectPath, entityId, entityType, setLinks, setDeletingLinkId, setError]
  )
}

export function useLinkSection(entityId: string, entityType: 'issue' | 'doc') {
  const { projectPath } = usePathContext()
  const { buildLinkRoute } = useLinkRoutes()
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const fetchLinks = useFetchLinks(
    projectPath,
    entityId,
    entityType,
    setLinks,
    setLoading,
    setError
  )
  const handleDeleteLink = useDeleteLink(
    projectPath,
    entityId,
    entityType,
    setLinks,
    setDeletingLinkId,
    setError
  )
  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])
  const handleLinkCreated = useCallback(() => {
    fetchLinks()
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
