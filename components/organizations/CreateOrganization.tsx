'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useCreateOrganization } from './useCreateOrganization'

export function CreateOrganization() {
  const hook = useCreateOrganization()

  return (
    <div className="create-organization">
      <div className="create-organization-header">
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
        <h2>Create New Organization</h2>
      </div>
      {hook.error && <DaemonErrorMessage error={hook.error} />}
      <form
        onSubmit={e => {
          e.preventDefault()
          hook.handleSubmit()
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
            value={hook.name}
            onChange={e => hook.setName(e.target.value)}
            placeholder="Organization name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            type="text"
            value={hook.slug}
            onChange={e => hook.handleSlugChange(e.target.value)}
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
            value={hook.description}
            onChange={e => hook.setDescription(e.target.value)}
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
            disabled={hook.saving || !hook.name.trim()}
            className="save-btn"
          >
            {hook.saving ? 'Creating...' : 'Create Organization'}
          </button>
        </div>
      </form>
    </div>
  )
}
