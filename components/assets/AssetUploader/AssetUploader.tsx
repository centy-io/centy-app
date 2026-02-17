'use client'

import { forwardRef, useImperativeHandle, useEffect } from 'react'
import type { AssetUploaderHandle, AssetUploaderProps } from './types'
import { useAssetUploader } from './useAssetUploader'
import { AssetPreviewItem } from './AssetPreviewItem'
import { PendingAssetPreviewItem } from './PendingAssetPreviewItem'

export const AssetUploader = forwardRef<
  AssetUploaderHandle,
  AssetUploaderProps
>(function AssetUploader(props, ref) {
  const {
    assets,
    pendingAssets,
    isDragging,
    error,
    setError,
    fileInputRef,
    handleFiles,
    uploadAllPending,
    removeAsset,
    removePending,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useAssetUploader(props)

  useImperativeHandle(ref, () => ({
    uploadAllPending,
  }))

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      pendingAssets.forEach(p => {
        if (p.preview) URL.revokeObjectURL(p.preview)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="asset-uploader">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,application/pdf"
          onChange={e => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div className="drop-zone-content">
          <span className="drop-zone-icon">+</span>
          <span className="drop-zone-text">
            {isDragging
              ? 'Drop files here...'
              : 'Drag & drop files or click to browse'}
          </span>
          <span className="drop-zone-hint">
            Images, videos, or PDFs (max 50MB)
          </span>
        </div>
      </div>

      {error && (
        <div className="asset-error">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Asset Grid */}
      {(assets.length > 0 || pendingAssets.length > 0) && (
        <div className="asset-grid">
          {assets.map(asset => (
            <AssetPreviewItem
              key={asset.filename}
              asset={asset}
              projectPath={props.projectPath}
              issueId={props.issueId!}
              onRemove={() => removeAsset(asset.filename)}
            />
          ))}
          {pendingAssets.map(pending => (
            <PendingAssetPreviewItem
              key={pending.id}
              pending={pending}
              onRemove={() => removePending(pending.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
})
