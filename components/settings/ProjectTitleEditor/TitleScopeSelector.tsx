'use client'

import type { ReactElement } from 'react'
import type { TitleScope } from './TitleScope'

interface TitleScopeSelectorProps {
  scope: TitleScope
  onScopeChange: (scope: TitleScope) => void
}

export function TitleScopeSelector({
  scope,
  onScopeChange,
}: TitleScopeSelectorProps): ReactElement {
  return (
    <div className="title-scope-selector">
      <span className="title-scope-label">Title Scope:</span>
      <div className="title-scope-buttons">
        <button
          type="button"
          onClick={() => {
            onScopeChange('user')
          }}
          className={`title-scope-btn ${scope === 'user' ? 'active' : ''}`}
        >
          User (local)
        </button>
        <button
          type="button"
          onClick={() => {
            onScopeChange('project')
          }}
          className={`title-scope-btn ${scope === 'project' ? 'active' : ''}`}
        >
          Project (shared)
        </button>
      </div>
    </div>
  )
}
