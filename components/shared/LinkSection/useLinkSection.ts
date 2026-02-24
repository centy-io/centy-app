import {
  useState,
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react'
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

function toProto(t: 'issue' | 'doc') {
  return t === 'issue' ? LinkTargetType.ISSUE : LinkTargetType.DOC
}

interface LinkSetters {
  setLinks: (links: LinkType[]) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

async function fetchLinks(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  setters: LinkSetters
) {
  if (!projectPath || !entityId) return
  setters.setLoading(true)
  setters.setError(null)
  try {
    const req = create(ListLinksRequestSchema, {
      projectPath,
      entityId,
      entityType: toProto(entityType),
    })
    const res = await centyClient.listLinks(req)
    setters.setLinks(res.links)
  } catch (err) {
    setters.setError(
      err instanceof Error ? err.message : 'Failed to load links'
    )
  } finally {
    setters.setLoading(false)
  }
}

async function deleteLink(
  projectPath: string,
  entityId: string,
  entityType: 'issue' | 'doc',
  link: LinkType,
  setDeletingLinkId: (id: string | null) => void,
  setError: (e: string | null) => void,
  setLinks: Dispatch<SetStateAction<LinkType[]>>
) {
  if (!projectPath || !entityId) return
  setDeletingLinkId(`${link.targetId}-${link.linkType}`)
  setError(null)
  try {
    const req = create(DeleteLinkRequestSchema, {
      projectPath,
      sourceId: entityId,
      sourceType: toProto(entityType),
      targetId: link.targetId,
      targetType: link.targetType,
      linkType: link.linkType,
    })
    const res = await centyClient.deleteLink(req)
    if (res.success) {
      setLinks(prev =>
        prev.filter(
          l => !(l.targetId === link.targetId && l.linkType === link.linkType)
        )
      )
    } else {
      setError(res.error || 'Failed to delete link')
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete link')
  } finally {
    setDeletingLinkId(null)
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
  const doFetchLinks = useCallback(
    () =>
      fetchLinks(projectPath, entityId, entityType, {
        setLinks,
        setLoading,
        setError,
      }),
    [projectPath, entityId, entityType]
  )
  const handleDeleteLink = useCallback(
    (link: LinkType) =>
      deleteLink(
        projectPath,
        entityId,
        entityType,
        link,
        setDeletingLinkId,
        setError,
        setLinks
      ),
    [projectPath, entityId, entityType]
  )
  useEffect(() => {
    doFetchLinks()
  }, [doFetchLinks])
  const handleLinkCreated = useCallback(() => {
    doFetchLinks()
    setShowAddModal(false)
  }, [doFetchLinks])
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
