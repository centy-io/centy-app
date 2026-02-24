/* eslint-disable max-lines */
'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'

interface CreateOrganizationFormProps {
  name: string
  setName: (value: string) => void
  slug: string
  onSlugChange: (value: string) => void
  description: string
  setDescription: (value: string) => void
  saving: boolean
  onSubmit: () => void
}

function NameField({
  name,
  setName,
}: {
  name: string
  setName: (v: string) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="name">
        Name <span className="required">*</span>
      </label>
      <input
        className="form-input"
        id="name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Organization name"
        required
      />
    </div>
  )
}

function SlugField({
  slug,
  onSlugChange,
}: {
  slug: string
  onSlugChange: (v: string) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="slug">
        Slug
      </label>
      <input
        className="form-input"
        id="slug"
        type="text"
        value={slug}
        onChange={e => onSlugChange(e.target.value)}
        placeholder="Auto-generated from name"
      />
      <span className="form-hint">
        Unique identifier (kebab-case). Leave empty to auto-generate.
      </span>
    </div>
  )
}

function DescriptionField({
  description,
  setDescription,
}: {
  description: string
  setDescription: (v: string) => void
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="description">
        Description
      </label>
      <textarea
        className="form-textarea"
        id="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={3}
      />
    </div>
  )
}

export function CreateOrganizationForm({
  name,
  setName,
  slug,
  onSlugChange,
  description,
  setDescription,
  saving,
  onSubmit,
}: CreateOrganizationFormProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      className="create-organization-form"
    >
      <NameField name={name} setName={setName} />
      <SlugField slug={slug} onSlugChange={onSlugChange} />
      <DescriptionField
        description={description}
        setDescription={setDescription}
      />
      <div className="form-actions">
        <Link
          href={route({ pathname: '/organizations' })}
          className="cancel-btn"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="save-btn"
        >
          {saving ? 'Creating...' : 'Create Organization'}
        </button>
      </div>
    </form>
  )
}
