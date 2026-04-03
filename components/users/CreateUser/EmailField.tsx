'use client'

interface EmailFieldProps {
  email: string
  setEmail: (v: string) => void
}

export function EmailField({ email, setEmail }: EmailFieldProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="email">
        Email
      </label>
      <input
        className="form-input"
        id="email"
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value)
        }}
        placeholder="Email address (optional)"
      />
    </div>
  )
}
