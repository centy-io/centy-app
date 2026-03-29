'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { useOrgDetailState } from './useOrgDetailState'
import { fetchOrgAndProjects } from './fetchOrgAndProjects'
import { performUpdateOrg } from './performUpdateOrg'
import { formatOrgErr } from './formatOrgErr'
import { centyClient } from '@/lib/grpc/client'
import { DeleteOrganizationRequestSchema } from '@/gen/centy_pb'

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

  const handleSave = useCallback(async () => {
    if (!orgSlug) return
    st.setSaving(true)
    st.setError(null)
    try {
      const result = await performUpdateOrg(
        orgSlug,
        st.editName,
        st.editDescription,
        st.editSlug
      )
      if ('error' in result) {
        st.setError(result.error)
      } else {
        st.setOrganization(result.org)
        st.setIsEditing(false)
        if (result.org.slug !== orgSlug)
          router.push(
            route({
              pathname: '/organizations/[orgSlug]',
              query: { orgSlug: result.org.slug },
            })
          )
      }
    } catch (err) {
      st.setError(formatOrgErr(err))
    } finally {
      st.setSaving(false)
    }
  }, [orgSlug, st.editName, st.editDescription, st.editSlug, router])

  const handleDelete = useCallback(async () => {
    if (!orgSlug) return
    st.setDeleting(true)
    st.setDeleteError(null)
    try {
      const res = await centyClient.deleteOrganization(
        create(DeleteOrganizationRequestSchema, { slug: orgSlug })
      )
      if (res.success) router.push(route({ pathname: '/organizations' }))
      else st.setDeleteError(res.error || 'Failed to delete organization')
    } catch (err) {
      st.setDeleteError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      st.setDeleting(false)
    }
  }, [orgSlug, router])

  const handleCancelEdit = (): void => {
    st.setIsEditing(false)
    if (!st.organization) return
    st.setEditName(st.organization.name)
    st.setEditDescription(st.organization.description || '')
    st.setEditSlug(st.organization.slug)
  }

  return {
    ...st,
    handleSave,
    handleDelete,
    handleCancelEdit,
    fetchOrganization,
  }
}
