'use client'

import Link from 'next/link'
import { type RouteLiteral } from 'nextjs-routes'

interface FormActionsProps {
  saving: boolean
  name: string
  usersListUrl: RouteLiteral
}

export function FormActions({ saving, name, usersListUrl }: FormActionsProps) {
  return (
    <div className="form-actions">
      <Link href={usersListUrl} className="cancel-btn">
        Cancel
      </Link>
      <button
        type="submit"
        disabled={saving || !name.trim()}
        className="save-btn"
      >
        {saving ? 'Creating...' : 'Create User'}
      </button>
    </div>
  )
}
