'use client'

interface NameFieldProps {
  name: string
  setName: (v: string) => void
}

export function NameField({ name, setName }: NameFieldProps) {
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
        placeholder="Display name"
        required
      />
    </div>
  )
}
