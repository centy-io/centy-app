'use client'

import type { Organization } from '@/gen/centy_pb'

interface OrgEditFormProps {
  editName: string
  setEditName: (v: string) => void
  editSlug: string
  setEditSlug: (v: string) => void
  editDescription: string
  setEditDescription: (v: string) => void
  organization: Organization
}

export function OrgEditForm(props: OrgEditFormProps) {
  const { organization } = props
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-name">Name:</label>
        <input
          id="edit-name"
          type="text"
          value={props.editName}
          onChange={e => props.setEditName(e.target.value)}
          placeholder="Organization name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-slug">Slug:</label>
        <input
          id="edit-slug"
          type="text"
          value={props.editSlug}
          onChange={e => props.setEditSlug(e.target.value)}
          placeholder="organization-slug"
        />
        {props.editSlug !== organization.slug && (
          <p className="field-hint warning">
            Changing the slug will update the URL. Make sure to update any
            references.
          </p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="edit-description">Description:</label>
        <textarea
          id="edit-description"
          value={props.editDescription}
          onChange={e => props.setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
      </div>
    </div>
  )
}
