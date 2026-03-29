'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { useOrgListState } from './useOrgListState'
import { buildContextMenuItems } from './buildContextMenuItems'
import { formatListErr } from './formatListErr'
import { formatDeleteErr } from './formatDeleteErr'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'

export function useOrganizationsList() {
  const router = useRouter()
  const st = useOrgListState()

  const fetchOrganizations = useCallback(async () => {
    st.setLoading(true)
    st.setError(null)
    try {
      const response = await centyClient.listOrganizations(
        create(ListOrganizationsRequestSchema, {})
      )
      st.setOrganizations(response.organizations)
    } catch (err) {
      st.setError(formatListErr(err))
    } finally {
      st.setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = useCallback(async (slug: string) => {
    st.setDeleting(true)
    st.setDeleteError(null)
    try {
      const response = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug })
      )
      if (response.success) {
        st.setOrganizations(prev => prev.filter(o => o.slug !== slug))
        st.setShowDeleteConfirm(null)
      } else if (response.error === 'ORG_HAS_PROJECTS') {
        st.setShowDeleteConfirm(null)
        st.setShowCascadeConfirm(slug)
      } else
        st.setDeleteError(response.error || 'Failed to delete organization')
    } catch (err) {
      st.setDeleteError(formatDeleteErr(err))
    } finally {
      st.setDeleting(false)
    }
  }, [])

  const handleDeleteCascade = useCallback(async (slug: string) => {
    st.setDeleting(true)
    st.setDeleteError(null)
    try {
      const response = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug, cascade: true })
      )
      if (response.success) {
        st.setOrganizations(prev => prev.filter(o => o.slug !== slug))
        st.setShowCascadeConfirm(null)
      } else
        st.setDeleteError(response.error || 'Failed to delete organization')
    } catch (err) {
      st.setDeleteError(formatDeleteErr(err))
    } finally {
      st.setDeleting(false)
    }
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, org: Organization) => {
      e.preventDefault()
      st.setContextMenu({ x: e.clientX, y: e.clientY, org })
    },
    []
  )

  const contextMenuItems: ContextMenuItem[] = st.contextMenu
    ? buildContextMenuItems(
        st.contextMenu,
        router,
        st.setShowDeleteConfirm,
        st.setContextMenu
      )
    : []

  return {
    ...st,
    contextMenuItems,
    fetchOrganizations,
    handleDelete,
    handleDeleteCascade,
    handleContextMenu,
  }
}
