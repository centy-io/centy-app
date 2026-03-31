'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { useOrgDetailState } from './useOrgDetailState'
import { fetchOrgAndProjects } from './fetchOrgAndProjects'
import { performSaveOrganization } from './performSaveOrganization'
import { performDeleteOrganization } from './performDeleteOrganization'
import { formatOrgErr } from './formatOrgErr'

type OrgDetailState = ReturnType<typeof useOrgDetailState>

function buildCancelEdit(st: OrgDetailState): () => void {
  return () => {
    st.setIsEditing(false)
    if (!st.organization) return
    st.setEditName(st.organization.name)
    st.setEditDescription(st.organization.description || '')
    st.setEditSlug(st.organization.slug)
  }
}

export function useOrganizationDetail(orgSlug: string) {
  const router = useRouter()
  const st = useOrgDetailState()

  const fetchOrganization = useCallback(async () => {
    if (!orgSlug) {
      st.setError('Missing organization slug')
      st.setLoading(false)
      return
    }
    st.setLoading(true)
    st.setError(null)
    try {
      const result = await fetchOrgAndProjects(orgSlug)
      if (typeof result === 'string') {
        st.setError(result)
        return
      }
      st.setOrganization(result.org)
      st.setEditName(result.org.name)
      st.setEditDescription(result.org.description || '')
      st.setEditSlug(result.org.slug)
      st.setProjects(result.projects)
    } catch (err) {
      st.setError(formatOrgErr(err))
    } finally {
      st.setLoading(false)
    }
  }, [orgSlug])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSave = useCallback(
    () =>
      performSaveOrganization({
        orgSlug,
        editName: st.editName,
        editDescription: st.editDescription,
        editSlug: st.editSlug,
        setSaving: st.setSaving,
        setError: st.setError,
        setOrganization: st.setOrganization,
        setIsEditing: st.setIsEditing,
        router,
      }),
    [orgSlug, st.editName, st.editDescription, st.editSlug, router]
  )

  const handleDelete = useCallback(
    () =>
      performDeleteOrganization({
        orgSlug,
        setDeleting: st.setDeleting,
        setDeleteError: st.setDeleteError,
        onSuccess: () => router.push(route({ pathname: '/organizations' })),
      }),
    [orgSlug, router]
  )

  return {
    ...st,
    handleSave,
    handleDelete,
    handleCancelEdit: buildCancelEdit(st),
    fetchOrganization,
  }
}
