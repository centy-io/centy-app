'use client'

interface UserIdFieldProps {
  userId: string
  onUserIdChange: (v: string) => void
}

export function UserIdField({ userId, onUserIdChange }: UserIdFieldProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="userId">
        User ID
      </label>
      <input
        className="form-input"
        id="userId"
        type="text"
        value={userId}
        onChange={e => {
          onUserIdChange(e.target.value)
        }}
        placeholder="Auto-generated from name"
      />
      <span className="form-hint">
        Unique identifier (slug format). Leave empty to auto-generate.
      </span>
    </div>
  )
}
