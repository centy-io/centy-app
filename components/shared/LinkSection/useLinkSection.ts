import { useState, useCallback } from 'react'
import { useLinkFetch } from './useLinkFetch'
import { useLinkRoutes } from './useLinkRoutes'
import type { Link as LinkType } from '@/gen/centy_pb'

export function useLinkSection(entityId: string, entityType: string) {
  const { buildLinkRoute } = useLinkRoutes()
  const {
    links,
    linkTitles,
    loading,
    error,
    deletingLinkId,
    fetchLinks,
    handleDeleteLink,
  } = useLinkFetch(entityId, entityType)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const handleLinkCreated = useCallback(() => {
    void fetchLinks()
    setShowAddModal(false)
  }, [fetchLinks])
  const handleLinkUpdated = useCallback(() => {
    void fetchLinks()
    setEditingLink(null)
  }, [fetchLinks])
  return {
    links,
    linkTitles,
    loading,
    error,
    showAddModal,
    setShowAddModal,
    deletingLinkId,
    editingLink,
    setEditingLink,
    buildLinkRoute,
    handleDeleteLink,
    handleLinkCreated,
    handleLinkUpdated,
  }
}
