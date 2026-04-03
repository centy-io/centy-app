'use client'

import type { ReactElement } from 'react'
import { SharedAssetCard } from './SharedAssetCard'
import { useSharedAssets } from './useSharedAssets'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export const formatFileSize = (bytes: bigint | number): string => {
  const size = Number(bytes)
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

interface AssetsContentProps {
  shared: ReturnType<typeof useSharedAssets>
}

export function AssetsContent({ shared }: AssetsContentProps): ReactElement {
  return (
    <>
      {shared.error && <DaemonErrorMessage error={shared.error} />}

      {shared.loading && shared.assets.length === 0 ? (
        <div className="loading">Loading shared assets...</div>
      ) : shared.assets.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No shared assets found</p>
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
              onPreview={asset => {
                void shared.handlePreview(asset)
              }}
              onDeleteConfirm={shared.setDeleteConfirm}
              onDelete={filename => {
                void shared.handleDelete(filename)
              }}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </>
  )
}
