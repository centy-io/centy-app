'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useSharedAssets } from './useSharedAssets'
import { AssetCard } from './AssetCard'
import { PreviewModal } from './PreviewModal'

const formatFileSize = (bytes: bigint | number) => {
  const size = Number(bytes)
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function SharedAssets() {
  const {
    projectPath,
    isInitialized,
    assets,
    loading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    previewAsset,
    fetchAssets,
    handleDelete,
    handlePreview,
    closePreview,
  } = useSharedAssets()

  return (
    <div className="shared-assets">
      <div className="shared-assets-header">
        <h2>Shared Assets</h2>
        <div className="header-actions">
          {projectPath && isInitialized === true && (
            <button
              onClick={fetchAssets}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? 'Loading...' : 'Refresh'}
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
          {error && <DaemonErrorMessage error={error} />}

          {loading && assets.length === 0 ? (
            <div className="loading">Loading shared assets...</div>
          ) : assets.length === 0 ? (
            <div className="empty-state">
              <p>No shared assets found</p>
              <p className="hint">
                Shared assets are files that can be referenced across multiple
                issues
              </p>
            </div>
          ) : (
            <div className="assets-grid">
              {assets.map(asset => (
                <AssetCard
                  key={asset.filename}
                  asset={asset}
                  deleteConfirm={deleteConfirm}
                  deleting={deleting}
                  onPreview={handlePreview}
                  onDeleteConfirm={setDeleteConfirm}
                  onDelete={handleDelete}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          )}
        </>
      )}

      {previewAsset && (
        <PreviewModal
          asset={previewAsset.asset}
          url={previewAsset.url}
          onClose={closePreview}
        />
      )}
    </div>
  )
}
