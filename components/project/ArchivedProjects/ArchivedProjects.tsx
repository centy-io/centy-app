'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useArchivedProjectActions } from './useArchivedProjectActions'
import { RemoveAllControl, ArchivedList } from './ArchivedProjectsControls'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function ArchivedProjects(): ReactElement {
  const state = useArchivedProjectActions()

  return (
    <div className="archived-projects">
      <div className="archived-header">
        <h2 className="archived-title">Archived Projects</h2>
        <div className="archived-header-actions">
          {state.hasArchivedProjects && !state.loading && (
            <RemoveAllControl state={state} />
          )}
          <Link href={route({ pathname: '/' })} className="back-link">
            Back to Projects
          </Link>
        </div>
      </div>
      {state.error && <DaemonErrorMessage error={state.error} />}
      <ArchivedList state={state} />
    </div>
  )
}
