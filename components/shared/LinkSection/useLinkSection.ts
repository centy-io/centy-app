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

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

function toProto(entityType: 'issue' | 'doc') {
  return entityType === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}

async function fetchLinksApi(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  setLinks: SetState<LinkType[]>,
  setLoading: SetState<boolean>,
  setError: SetState<string | null>
) {
  if (!projectPath || !entityId) return
  setLoading(true)
  setError(null)
  try {
    const response = await centyClient.listLinks(
      create(ListLinksRequestSchema, {
        projectPath,
        entityId,
        entityType: toProto(entityType),
      })
    )
    setLinks(response.links)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load links')
  } finally {
    setLoading(false)
  }
}

async function deleteLinkApi(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  link: LinkType,
  setLinks: SetState<LinkType[]>,
  setDeletingId: SetState<string | null>,
  setError: SetState<string | null>
) {
  if (!projectPath || !entityId) return
  setDeletingId(`${link.targetId}-${link.linkType}`)
  setError(null)
  try {
    const response = await centyClient.deleteLink(
      create(DeleteLinkRequestSchema, {
        projectPath,
        sourceId: entityId,
        sourceType: toProto(entityType),
        targetId: link.targetId,
        targetType: link.targetType,
        linkType: link.linkType,
      })
    )
    if (response.success) {
      setLinks(prev =>
        prev.filter(
          l => !(l.targetId === link.targetId && l.linkType === link.linkType)
        )
      )
    } else {
      setError(response.error || 'Failed to delete link')
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete link')
  } finally {
    setDeletingId(null)
  }
}

export function useLinkSection(entityId: string, entityType: 'issue' | 'doc') {
  const { projectPath } = usePathContext()
  const { buildLinkRoute } = useLinkRoutes()
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const fetchLinks = useCallback(
    () =>
      fetchLinksApi(
        projectPath,
        entityId,
        entityType,
        setLinks,
        setLoading,
        setError
      ),
    [projectPath, entityId, entityType]
  )
  const handleDeleteLink = useCallback(
    (link: LinkType) =>
      deleteLinkApi(
        projectPath,
        entityId,
        entityType,
        link,
        setLinks,
        setDeletingLinkId,
        setError
      ),
    [projectPath, entityId, entityType]
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
