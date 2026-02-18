'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateOrganizationRequestSchema } from '@/gen/centy_pb'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { generateSlug } from '@/lib/generate-slug'
import { CreateOrganizationForm } from './CreateOrganization.form'

export function CreateOrganization() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallySet, setSlugManuallySet] = useState(false)
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug from name if not manually set
  useEffect(() => {
    if (!slugManuallySet && name) {
      setSlug(generateSlug(name))
    }
  }, [name, slugManuallySet])

  const handleSlugChange = (value: string) => {
    setSlug(value)
    setSlugManuallySet(true)
  }

  const handleSubmit = useCallback(async () => {
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
  }, [name, slug, description, router])

  useSaveShortcut({
    onSave: handleSubmit,
    enabled: !saving && !!name.trim(),
  })

  return (
    <div className="create-organization">
      <div className="create-organization-header">
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
        <h2>Create New Organization</h2>
      </div>

      {error && <DaemonErrorMessage error={error} />}

      <CreateOrganizationForm
        name={name}
        setName={setName}
        slug={slug}
        onSlugChange={handleSlugChange}
        description={description}
        setDescription={setDescription}
        saving={saving}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
