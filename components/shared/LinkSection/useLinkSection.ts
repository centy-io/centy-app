'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListLinksRequestSchema,
  DeleteLinkRequestSchema,
  type Link as LinkType,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { targetTypeToProto } from './LinkSection.types'
import { useLinkRoutes } from './useLinkRoutes'

export function useLinkSection(entityId: string, entityType: 'issue' | 'doc') {
  const { projectPath } = useProject()
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
        entityType: targetTypeToProto[entityType],
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
    fetchLinks()
  }, [fetchLinks])

  const handleDeleteLink = useCallback(
    async (link: LinkType) => {
      if (!projectPath || !entityId) return
      const linkKey = `${link.targetId}-${link.linkType}`
      setDeletingLinkId(linkKey)
      setError(null)
      try {
        const request = create(DeleteLinkRequestSchema, {
          projectPath,
          sourceId: entityId,
          sourceType: targetTypeToProto[entityType],
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
    [projectPath, entityId, entityType]
  )

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
