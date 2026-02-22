'use client'

import Link from 'next/link'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import { PinnedItemsSection } from '@/components/project/PinnedItemsSection'

export function ProjectDashboard() {
  const { projectName, isInitialized, isLoading, displayPath } =
    usePathContext()
  const { createLink } = useAppLink()
  const { pinnedItems, unpinItem, reorderItems } = usePinnedItems()

  if (isLoading) {
    return (
      <div className="project-dashboard-loading">
        <p className="dashboard-loading-text">Loading project...</p>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="project-dashboard-not-initialized">
        <p className="not-initialized-text">
          Centy is not initialized in this directory
        </p>
        <Link href={createLink('/')}>Initialize Project</Link>
      </div>
    )
  }

  return (
    <div className="project-dashboard">
      <div className="project-dashboard-header">
        <h1 className="project-dashboard-title">{projectName}</h1>
        {displayPath && (
          <div className="project-dashboard-path">{displayPath}</div>
        )}
      </div>

      <PinnedItemsSection
        items={pinnedItems}
        onUnpin={unpinItem}
        onReorder={reorderItems}
      />

      <div className="dashboard-quick-links">
        <Link href={createLink('/issues')} className="dashboard-quick-link">
          <span className="dashboard-quick-link-icon">&#9776;</span>
          <div className="dashboard-quick-link-info">
            <span className="dashboard-quick-link-title">Issues</span>
            <span className="dashboard-quick-link-desc">
              Track bugs and tasks
            </span>
          </div>
        </Link>
        <Link href={createLink('/docs')} className="dashboard-quick-link">
          <span className="dashboard-quick-link-icon">&#9997;</span>
          <div className="dashboard-quick-link-info">
            <span className="dashboard-quick-link-title">Docs</span>
            <span className="dashboard-quick-link-desc">
              Project documentation
            </span>
          </div>
        </Link>
        <Link
          href={createLink('/pull-requests')}
          className="dashboard-quick-link"
        >
          <span className="dashboard-quick-link-icon">&#8644;</span>
          <div className="dashboard-quick-link-info">
            <span className="dashboard-quick-link-title">Pull Requests</span>
            <span className="dashboard-quick-link-desc">
              Code review and merges
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
