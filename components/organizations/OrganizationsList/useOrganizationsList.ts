'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { useOrgListState } from './useOrgListState'
import { buildContextMenuItems } from './buildContextMenuItems'
import { formatListErr } from './formatListErr'
import { performDeleteOrg } from './performDeleteOrg'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import type { ContextMenuItem } from '@/components/shared/ContextMenuItem'

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
    void fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = useCallback(async (slug: string) => {
    await performDeleteOrg({
      slug,
      setDeleting: st.setDeleting,
      setDeleteError: st.setDeleteError,
      setOrganizations: st.setOrganizations,
      setShowDeleteConfirm: st.setShowDeleteConfirm,
      setShowCascadeConfirm: st.setShowCascadeConfirm,
    })
  }, [])

  const handleDeleteCascade = useCallback(async (slug: string) => {
    await performDeleteOrg({
      slug,
      cascade: true,
      setDeleting: st.setDeleting,
      setDeleteError: st.setDeleteError,
      setOrganizations: st.setOrganizations,
      setShowDeleteConfirm: st.setShowDeleteConfirm,
      setShowCascadeConfirm: st.setShowCascadeConfirm,
    })
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
