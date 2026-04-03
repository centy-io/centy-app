'use client'

interface OrgEditFormProps {
  editName: string
  editDescription: string
  editSlug: string
  currentSlug: string
  setEditName: (v: string) => void
  setEditDescription: (v: string) => void
  setEditSlug: (v: string) => void
}

export function OrgEditForm(props: OrgEditFormProps): React.JSX.Element {
  const {
    editName,
    editDescription,
    editSlug,
    currentSlug,
    setEditName,
    setEditDescription,
    setEditSlug,
  } = props
  return (
    <div className="edit-form">
      <div className="form-group">
        <label className="form-label" htmlFor="edit-name">
          Name:
        </label>
        <input
          className="form-input"
          id="edit-name"
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Organization name"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="edit-slug">
          Slug:
        </label>
        <input
          className="form-input"
          id="edit-slug"
          type="text"
          value={editSlug}
          onChange={e => setEditSlug(e.target.value)}
          placeholder="organization-slug"
        />
        {editSlug !== currentSlug && (
          <p className="field-hint warning">
            Changing the slug will update the URL. Make sure to update any
            references.
          </p>
        )}
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="edit-description">
          Description:
        </label>
        <textarea
          className="form-textarea"
          id="edit-description"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
      </div>
    </div>
  )
}
