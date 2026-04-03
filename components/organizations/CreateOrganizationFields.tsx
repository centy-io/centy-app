'use client'

interface NameFieldProps {
  name: string
  setName: (value: string) => void
}

export function NameField({
  name,
  setName,
}: NameFieldProps): React.JSX.Element {
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
        onChange={e => {
          setName(e.target.value)
        }}
        placeholder="Organization name"
        required
      />
    </div>
  )
}

interface SlugFieldProps {
  slug: string
  onSlugChange: (value: string) => void
}

export function SlugField({
  slug,
  onSlugChange,
}: SlugFieldProps): React.JSX.Element {
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
        onChange={e => {
          onSlugChange(e.target.value)
        }}
        placeholder="Auto-generated from name"
      />
      <span className="form-hint">
        Unique identifier (kebab-case). Leave empty to auto-generate.
      </span>
    </div>
  )
}

interface DescriptionFieldProps {
  description: string
  setDescription: (value: string) => void
}

export function DescriptionField({
  description,
  setDescription,
}: DescriptionFieldProps): React.JSX.Element {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="description">
        Description
      </label>
      <textarea
        className="form-textarea"
        id="description"
        value={description}
        onChange={e => {
          setDescription(e.target.value)
        }}
        placeholder="Description (optional)"
        rows={3}
      />
    </div>
  )
}
