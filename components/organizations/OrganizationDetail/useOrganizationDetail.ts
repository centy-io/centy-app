'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
  UpdateOrganizationRequestSchema,
  DeleteOrganizationRequestSchema,
  ListProjectsRequestSchema,
  type Organization,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function useOrganizationDetail(orgSlug: string) {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchOrganization = useCallback(async () => {
    if (!orgSlug) {
      setError('Missing organization slug')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const request = create(GetOrganizationRequestSchema, { slug: orgSlug })
      const response = await centyClient.getOrganization(request)
      if (!response.found || !response.organization) {
        setError('Organization not found')
        setLoading(false)
        return
      }
      const org = response.organization
      setOrganization(org)
      setEditName(org.name)
      setEditDescription(org.description || '')
      setEditSlug(org.slug)
      const projectsRequest = create(ListProjectsRequestSchema, {
        organizationSlug: orgSlug,
      })
      const projectsResponse = await centyClient.listProjects(projectsRequest)
      setProjects(projectsResponse.projects)
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
  }, [orgSlug])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSave = useCallback(async () => {
    if (!orgSlug) return
    setSaving(true)
    setError(null)
    try {
      const request = create(UpdateOrganizationRequestSchema, {
        slug: orgSlug,
        name: editName,
        description: editDescription,
        newSlug: editSlug !== orgSlug ? editSlug : undefined,
      })
      const response = await centyClient.updateOrganization(request)
      if (response.success && response.organization) {
        setOrganization(response.organization)
        setIsEditing(false)
        if (response.organization.slug !== orgSlug) {
          router.push(
            route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug: response.organization.slug },
            })
          )
        }
      } else {
        setError(response.error || 'Failed to update organization')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [orgSlug, editName, editDescription, editSlug, router])

  const handleDelete = useCallback(async () => {
    if (!orgSlug) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const request = create(DeleteOrganizationRequestSchema, { slug: orgSlug })
      const response = await centyClient.deleteOrganization(request)
      if (response.success) {
        router.push('/organizations')
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
  }, [orgSlug, router])

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (organization) {
      setEditName(organization.name)
      setEditDescription(organization.description || '')
      setEditSlug(organization.slug)
    }
  }

  useSaveShortcut({
    onSave: handleSave,
    enabled: isEditing && !saving && !!editName.trim(),
  })

  return {
    organization,
    projects,
    loading,
    error,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editSlug,
    setEditSlug,
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
    handleSave,
    handleDelete,
    handleCancelEdit,
  }
}
