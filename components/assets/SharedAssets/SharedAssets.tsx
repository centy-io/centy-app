'use client'

import type { ReactElement } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useSharedAssets } from './useSharedAssets'
import { PreviewModal } from './PreviewModal'
import { AssetsContent } from './AssetsContent'
import { useProject } from '@/components/providers/ProjectProvider'

export function SharedAssets(): ReactElement {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const shared = useSharedAssets(projectPath, isInitialized, setIsInitialized)

  return (
    <div className="shared-assets">
      <div className="shared-assets-header">
        <h2 className="shared-assets-title">Shared Assets</h2>
        <div className="header-actions">
          {projectPath && isInitialized === true && (
            <button
              onClick={() => {
                void shared.fetchAssets()
              }}
              disabled={shared.loading}
              className="refresh-btn"
            >
              {shared.loading ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      {!projectPath && (
        <div className="no-project-message">
          <p className="no-project-text">
            Select a project from the header to view shared assets
          </p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p className="not-initialized-text">
            Centy is not initialized in this directory
          </p>
          <Link href={route({ pathname: '/' })}>Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <AssetsContent shared={shared} />
      )}

      {shared.previewAsset && (
        <PreviewModal
          asset={shared.previewAsset.asset}
          url={shared.previewAsset.url}
          onClose={shared.closePreview}
        />
      )}
    </div>
  )
}
