'use client'

import Link from 'next/link'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSharedAssets } from './useSharedAssets'
import { SharedAssetCard } from './SharedAssetCard'
import { PreviewModal } from './PreviewModal'

const formatFileSize = (bytes: bigint | number) => {
  const size = Number(bytes)
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

// eslint-disable-next-line max-lines-per-function
export function SharedAssets() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const shared = useSharedAssets(projectPath, isInitialized, setIsInitialized)

  return (
    <div className="shared-assets">
      <div className="shared-assets-header">
        <h2>Shared Assets</h2>
        <div className="header-actions">
          {projectPath && isInitialized === true && (
            <button
              onClick={shared.fetchAssets}
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
          <p>Select a project from the header to view shared assets</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <>
          {shared.error && <DaemonErrorMessage error={shared.error} />}

          {shared.loading && shared.assets.length === 0 ? (
            <div className="loading">Loading shared assets...</div>
          ) : shared.assets.length === 0 ? (
            <div className="empty-state">
              <p>No shared assets found</p>
              <p className="hint">
                Shared assets are files that can be referenced across multiple
                issues
              </p>
            </div>
          ) : (
            <div className="assets-grid">
              {shared.assets.map(asset => (
                <SharedAssetCard
                  key={asset.filename}
                  asset={asset}
                  deleteConfirm={shared.deleteConfirm}
                  deleting={shared.deleting}
                  onPreview={shared.handlePreview}
                  onDeleteConfirm={shared.setDeleteConfirm}
                  onDelete={shared.handleDelete}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          )}
        </>
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
