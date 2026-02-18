'use client'

import { forwardRef } from 'react'
import type { AssetUploaderHandle, AssetUploaderProps } from './types'
import { useAssetUploader } from './useAssetUploader'
import { useAssetHandlers } from './useAssetHandlers'
import { useAssetRemoval } from './useAssetRemoval'
import { DropZone } from './DropZone'
import { AssetGrid } from './AssetGrid'

export const AssetUploader = forwardRef<
  AssetUploaderHandle,
  AssetUploaderProps
>(function AssetUploader(
  {
    projectPath,
    issueId,
    prId,
    onAssetsChange,
    onPendingChange,
    initialAssets = [],
    mode,
  },
  ref
) {
  const targetId = issueId || prId
  const uploader = useAssetUploader({
    projectPath,
    targetId,
    onAssetsChange,
    onPendingChange,
    initialAssets,
    mode,
  })

  const { handleFiles } = useAssetHandlers({
    uploader,
    targetId,
    mode,
    onPendingChange,
    ref,
  })

  const { removeAsset, removePending } = useAssetRemoval({
    uploader,
    projectPath,
    targetId,
    onAssetsChange,
    onPendingChange,
  })

  return (
    <div className="asset-uploader">
      <DropZone
        isDragging={uploader.isDragging}
        fileInputRef={uploader.fileInputRef}
        onDragOver={e => {
          e.preventDefault()
          uploader.setIsDragging(true)
        }}
        onDragLeave={e => {
          e.preventDefault()
          uploader.setIsDragging(false)
        }}
        onDrop={e => {
          e.preventDefault()
          uploader.setIsDragging(false)
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
        }}
        onFilesSelected={handleFiles}
      />
      {uploader.error && (
        <div className="asset-error">
          {uploader.error}
          <button onClick={() => uploader.setError(null)}>Dismiss</button>
        </div>
      )}
      <AssetGrid
        assets={uploader.assets}
        pendingAssets={uploader.pendingAssets}
        projectPath={projectPath}
        issueId={issueId}
        onRemoveAsset={removeAsset}
        onRemovePending={removePending}
      />
    </div>
  )
})
