'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'

interface ProjectSelectorFooterProps {
  manualPath: string
  setManualPath: (v: string) => void
  onManualSubmit: (e: React.FormEvent) => Promise<void>
  setIsOpen: (v: boolean) => void
}

export function ProjectSelectorFooter({
  manualPath,
  setManualPath,
  onManualSubmit,
  setIsOpen,
}: ProjectSelectorFooterProps) {
  return (
    <>
      <div className="project-selector-actions">
        <Link
          href={route({ pathname: '/' })}
          className="init-project-btn"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          {'\u2728'} Init Project
        </Link>
        <Link
          href={route({ pathname: '/archived' })}
          className="view-archived-link"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          View Archived Projects
        </Link>
      </div>
      <div className="project-selector-manual">
        <form
          className="manual-path-form"
          onSubmit={e => {
            void onManualSubmit(e)
          }}
        >
          <input
            type="text"
            value={manualPath}
            onChange={e => {
              setManualPath(e.target.value)
            }}
            placeholder="Or enter path manually..."
            className="manual-path-input"
          />
          <button
            type="submit"
            disabled={!manualPath.trim()}
            className="manual-path-submit"
          >
            Go
          </button>
        </form>
      </div>
    </>
  )
}
