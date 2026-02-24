/* eslint-disable max-lines */
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
import { isDaemonUnimplemented } from '@/lib/daemon-error'

function formatErr(err: unknown): string {
  const m = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(m)
    ? 'Organizations feature is not available. Please update your daemon.'
    : m
}

async function fetchOrgAndProjects(orgSlug: string) {
  const res = await centyClient.getOrganization(
    create(GetOrganizationRequestSchema, { slug: orgSlug })
  )
  if (!res.found || !res.organization)
    return { error: 'Organization not found' }
  const listRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  return { organization: res.organization, projects: listRes.projects }
}

async function updateOrgRequest(
  orgSlug: string,
  editName: string,
  editDescription: string,
  editSlug: string
) {
  return centyClient.updateOrganization(
    create(UpdateOrganizationRequestSchema, {
      slug: orgSlug,
      name: editName,
      description: editDescription,
      newSlug: editSlug !== orgSlug ? editSlug : undefined,
    })
  )
}

function useOrgEditState(organization: Organization | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSlug, setEditSlug] = useState('')

  const initFromOrg = useCallback((org: Organization) => {
    setEditName(org.name)
    setEditDescription(org.description || '')
    setEditSlug(org.slug)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    if (organization) initFromOrg(organization)
  }, [organization, initFromOrg])

  return {
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editSlug,
    setEditSlug,
    initFromOrg,
    handleCancelEdit,
  }
}

export function useOrganizationDetail(orgSlug: string) {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const editState = useOrgEditState(organization)

  const fetchOrganization = useCallback(async () => {
    if (!orgSlug) {
      setError('Missing organization slug')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetchOrgAndProjects(orgSlug)
      if (result.error) {
        setError(result.error)
        return
      }
      const org = result.organization!
      setOrganization(org)
      editState.initFromOrg(org)
      setProjects(result.projects || [])
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug, editState])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSave = useCallback(async () => {
    if (!orgSlug) return
    setSaving(true)
    setError(null)
    try {
      const res = await updateOrgRequest(
        orgSlug,
        editState.editName,
        editState.editDescription,
        editState.editSlug
      )
      if (res.success && res.organization) {
        setOrganization(res.organization)
        editState.setIsEditing(false)
        if (res.organization.slug !== orgSlug)
          router.push(
            route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug: res.organization.slug },
            })
          )
      } else {
        setError(res.error || 'Failed to update organization')
      }
    } catch (err) {
      setError(formatErr(err))
    } finally {
      setSaving(false)
    }
  }, [orgSlug, editState, router])

  const handleDelete = useCallback(async () => {
    if (!orgSlug) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug: orgSlug })
      )
      if (res.success) router.push(route({ pathname: '/organizations' }))
      else setDeleteError(res.error || 'Failed to delete organization')
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setDeleting(false)
    }
  }, [orgSlug, router])

  return {
    organization,
    projects,
    loading,
    error,
    saving,
    deleting,
    showDeleteConfirm,
    deleteError,
    setShowDeleteConfirm,
    setDeleteError,
    handleSave,
    handleDelete,
    ...editState,
  }
}
