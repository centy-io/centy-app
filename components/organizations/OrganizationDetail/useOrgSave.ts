'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { Organization } from '@/gen/centy_pb'
import { saveOrganization, deleteOrganization } from './orgDetailActions'

export function useOrgSave(
  orgSlug: string,
  editName: string,
  editDescription: string,
  editSlug: string,
  setOrganization: (org: Organization) => void,
  setIsEditing: (v: boolean) => void,
  setError: (v: string | null) => void,
  setSaving: (v: boolean) => void
) {
  const router = useRouter()

  return useCallback(async () => {
    if (!orgSlug) return
    setSaving(true)
    setError(null)
    try {
      const response = await saveOrganization({
        orgSlug,
        editName,
        editDescription,
        editSlug,
      })
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
  }, [
    orgSlug,
    editName,
    editDescription,
    editSlug,
    router,
    setOrganization,
    setIsEditing,
    setError,
    setSaving,
  ])
}

export function useOrgDelete(
  orgSlug: string,
  setDeleting: (v: boolean) => void,
  setDeleteError: (v: string | null) => void
) {
  const router = useRouter()

  return useCallback(async () => {
    if (!orgSlug) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const response = await deleteOrganization(orgSlug)
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
  }, [orgSlug, router, setDeleting, setDeleteError])
}
