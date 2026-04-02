'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateOrganizationRequestSchema } from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

interface UseCreateOrganizationSubmitParams {
  name: string
  slug: string
  description: string
  setSaving: (v: boolean) => void
  setError: (v: string | null) => void
}

export function useCreateOrganizationSubmit({
  name,
  slug,
  description,
  setSaving,
  setError,
}: UseCreateOrganizationSubmitParams) {
  const router = useRouter()
  return useCallback(async () => {
    if (!name.trim()) return

    setSaving(true)
    setError(null)

    try {
      const request = create(CreateOrganizationRequestSchema, {
        slug: slug.trim() || undefined,
        name: name.trim(),
        description: description.trim() || undefined,
      })
      const response = await centyClient.createOrganization(request)

      if (response.success && response.organization) {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: response.organization.slug },
          })
        )
      } else {
        const errorMsg = response.error || 'Failed to create organization'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'Organizations feature is not available. Please update your daemon.'
          )
        } else {
          setError(errorMsg)
        }
      }
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
      setSaving(false)
    }
  }, [name, slug, description, router, setSaving, setError])
}
