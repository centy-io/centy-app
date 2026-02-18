'use client'

import Link from 'next/link'

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
      <div className="form-group">
        <label htmlFor="name">
          Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Organization name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug">Slug</label>
        <input
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

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <Link href="/organizations" className="cancel-btn">
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
