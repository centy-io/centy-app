'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListOrganizationsRequestSchema,
  DeleteOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function useOrganizationsList() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const request = create(ListOrganizationsRequestSchema, {})
      const response = await centyClient.listOrganizations(request)
      setOrganizations(response.organizations)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      if (isDaemonUnimplemented(message)) {
        setError(
          'Organizations feature is not available. Please update your daemon.'
        )
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = useCallback(async (slug: string) => {
    setDeleting(true)
    setDeleteError(null)
    try {
      const request = create(DeleteOrganizationRequestSchema, { slug })
      const response = await centyClient.deleteOrganization(request)
      if (response.success) {
        setOrganizations(prev => prev.filter(o => o.slug !== slug))
        setShowDeleteConfirm(null)
      } else {
        setDeleteError(response.error || 'Failed to delete organization')
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setDeleting(false)
    }
  }, [])

  return {
    organizations,
    loading,
    error,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
    fetchOrganizations,
    handleDelete,
  }
}
