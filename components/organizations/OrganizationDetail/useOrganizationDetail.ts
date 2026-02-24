'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useOrgSave } from './useOrgSave'
import { useOrgDelete } from './useOrgDelete'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
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
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const editState = useOrgEditState(organization)
  const saveState = useOrgSave(orgSlug, setOrganization, editState)
  const deleteState = useOrgDelete(orgSlug)

  const fetchOrganization = useCallback(async () => {
    if (!orgSlug) {
      setLoadError('Missing organization slug')
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError(null)
    try {
      const result = await fetchOrgAndProjects(orgSlug)
      if (result.error) {
        setLoadError(result.error)
        return
      }
      const org = result.organization!
      setOrganization(org)
      editState.initFromOrg(org)
      setProjects(result.projects || [])
    } catch (err) {
      setLoadError(formatErr(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug, editState])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  return {
    organization,
    projects,
    loading,
    error: saveState.error || loadError,
    saving: saveState.saving,
    ...deleteState,
    ...editState,
    setError: saveState.setError,
    handleSave: saveState.handleSave,
  }
}
