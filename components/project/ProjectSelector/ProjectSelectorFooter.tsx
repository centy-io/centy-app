'use client'

import Link from 'next/link'

interface ProjectSelectorFooterProps {
  setIsOpen: (v: boolean) => void
  manualPath: string
  setManualPath: (v: string) => void
  handleManualSubmit: (e: React.FormEvent) => void
}

export function ProjectSelectorFooter(props: ProjectSelectorFooterProps) {
  const { setIsOpen, manualPath, setManualPath, handleManualSubmit } = props
  return (
    <>
      <div className="project-selector-actions">
        <Link
          href="/"
          className="init-project-btn"
          onClick={() => setIsOpen(false)}
        >
          {'\u2728'} Init Project
        </Link>
        <Link
          href="/archived"
          className="view-archived-link"
          onClick={() => setIsOpen(false)}
        >
          View Archived Projects
        </Link>
      </div>
      <div className="project-selector-manual">
        <form onSubmit={handleManualSubmit}>
          <input
            type="text"
            value={manualPath}
            onChange={e => setManualPath(e.target.value)}
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
