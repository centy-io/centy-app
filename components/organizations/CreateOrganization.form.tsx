'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import {
  NameField,
  SlugField,
  DescriptionField,
} from './CreateOrganizationFields'

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
}: CreateOrganizationFormProps): React.JSX.Element {
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
