import { useState, useCallback, useEffect } from 'react'
import { useLinkRoutes } from './useLinkRoutes'
import { fetchLinks } from './fetchLinks'
import { deleteLink } from './deleteLink'
import { type Link as LinkType } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

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
