'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { CreateOrganizationForm } from './CreateOrganization.form'
import { useCreateOrganizationSubmit } from './useCreateOrganizationSubmit'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { generateSlug } from '@/lib/generate-slug'

export function CreateOrganization() {
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

  const handleSubmit = useCreateOrganizationSubmit({
    name,
    slug,
    description,
    setSaving,
    setError,
  })

  useSaveShortcut({
    onSave: handleSubmit,
    enabled: !saving && !!name.trim(),
  })

  return (
    <div className="create-organization">
      <div className="create-organization-header">
        <Link
          href={route({ pathname: '/organizations' })}
          className="back-link"
        >
          Back to Organizations
        </Link>
        <h2 className="create-organization-title">Create New Organization</h2>
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
