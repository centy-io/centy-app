'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  UpdateOrganizationRequestSchema,
  type Organization,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface EditState {
  editName: string
  editDescription: string
  editSlug: string
  setIsEditing: (v: boolean) => void
}

function formatErr(err: unknown): string {
  const m = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(m)
    ? 'Organizations feature is not available. Please update your daemon.'
    : m
}

export function useOrgSave(
  orgSlug: string,
  setOrganization: (org: Organization) => void,
  editState: EditState
) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    if (!orgSlug) return
    setSaving(true)
    setError(null)
    try {
      const res = await centyClient.updateOrganization(
        create(UpdateOrganizationRequestSchema, {
          slug: orgSlug,
          name: editState.editName,
          description: editState.editDescription,
          newSlug:
            editState.editSlug !== orgSlug ? editState.editSlug : undefined,
        })
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
  }, [orgSlug, editState, setOrganization, router])

  return { saving, error, setError, handleSave }
}
