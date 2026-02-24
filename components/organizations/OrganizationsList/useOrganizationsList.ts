'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useOrgDeleteAction } from './useOrgDeleteAction'
import { useOrgTable } from './useOrgTable'
import { useOrgContextMenuState } from './useOrgContextMenuState'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function useOrganizationsList() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const deleteAction = useOrgDeleteAction(setOrganizations)
  const tableState = useOrgTable(organizations)
  const contextMenuState = useOrgContextMenuState(
    deleteAction.setShowDeleteConfirm
  )

  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await centyClient.listOrganizations(
        create(ListOrganizationsRequestSchema, {})
      )
      setOrganizations(response.organizations)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      setError(
        isDaemonUnimplemented(message)
          ? 'Organizations feature is not available. Please update your daemon.'
          : message
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    loading,
    error,
    ...deleteAction,
    ...tableState,
    ...contextMenuState,
    fetchOrganizations,
  }
}
