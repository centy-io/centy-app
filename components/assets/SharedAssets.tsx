'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListSharedAssetsRequestSchema,
  DeleteAssetRequestSchema,
  GetAssetRequestSchema,
  IsInitializedRequestSchema,
  type Asset,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

function formatFileSize(bytes: bigint | number) {
  const size = Number(bytes)
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

interface AssetCardProps {
  asset: Asset
  deleteConfirm: string | null
  deleting: boolean
  onPreview: (asset: Asset) => void
  onDeleteConfirm: (filename: string) => void
  onCancelDelete: () => void
  onDelete: (filename: string) => void
}

function AssetCard({
  asset,
  deleteConfirm,
  deleting,
  onPreview,
  onDeleteConfirm,
  onCancelDelete,
  onDelete,
}: AssetCardProps) {
  return (
    <div className="asset-card">
      <div className="asset-preview" onClick={() => onPreview(asset)}>
        {asset.mimeType.startsWith('image/') ? (
          <div className="preview-placeholder image">IMG</div>
        ) : asset.mimeType.startsWith('video/') ? (
          <div className="preview-placeholder video">VID</div>
        ) : (
          <div className="preview-placeholder file">FILE</div>
        )}
      </div>
      <div className="asset-info">
        <span className="asset-filename" title={asset.filename}>
          {asset.filename}
        </span>
        <div className="asset-meta">
          <span className="asset-size">{formatFileSize(asset.size)}</span>
          <span className="asset-type">{asset.mimeType}</span>
        </div>
      </div>
      <button
        className="asset-delete-btn"
        onClick={e => {
          e.stopPropagation()
          onDeleteConfirm(asset.filename)
        }}
        title="Delete asset"
      >
        x
      </button>
      {deleteConfirm === asset.filename && (
        <div className="delete-confirm-overlay">
          <p>Delete &ldquo;{asset.filename}&rdquo;?</p>
          <div className="delete-confirm-actions">
            <button onClick={onCancelDelete} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={() => onDelete(asset.filename)}
              disabled={deleting}
              className="confirm-delete-btn"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface AssetPreviewModalProps {
  previewAsset: { asset: Asset; url: string }
  onClose: () => void
}

function AssetPreviewModal({ previewAsset, onClose }: AssetPreviewModalProps) {
  return (
    <div className="preview-modal" onClick={onClose}>
      <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="preview-close-btn" onClick={onClose}>
          x
        </button>
        <h3>{previewAsset.asset.filename}</h3>
        {previewAsset.asset.mimeType.startsWith('image/') ? (
          <img src={previewAsset.url} alt={previewAsset.asset.filename} />
        ) : previewAsset.asset.mimeType.startsWith('video/') ? (
          <video src={previewAsset.url} controls />
        ) : (
          <div className="preview-download">
            <a href={previewAsset.url} download={previewAsset.asset.filename}>
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function useSharedAssetsInit(
  projectPath: string,
  setIsInitialized: (v: boolean | null) => void
) {
  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInitialized])
}

function useFetchSharedAssets(
  projectPath: string,
  isInitialized: boolean | null
) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const request = create(ListSharedAssetsRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listSharedAssets(request)
      setAssets(response.assets)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    if (isInitialized === true) fetchAssets()
  }, [isInitialized, fetchAssets])

  return { assets, setAssets, loading, error, setError, fetchAssets }
}

function useSharedAssetDelete(
  projectPath: string,
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
  setError: (e: string | null) => void
) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = useCallback(
    async (filename: string) => {
      if (!projectPath) return
      setDeleting(true)
      setError(null)
      try {
        const request = create(DeleteAssetRequestSchema, {
          projectPath,
          filename,
          isShared: true,
        })
        const response = await centyClient.deleteAsset(request)
        if (response.success) {
          setAssets(prev => prev.filter(a => a.filename !== filename))
          setDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete asset')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, setAssets, setError]
  )

  return { deleteConfirm, setDeleteConfirm, deleting, handleDelete }
}

function useAssetPreviewState(
  projectPath: string,
  setError: (e: string | null) => void
) {
  const [previewAsset, setPreviewAsset] = useState<{
    asset: Asset
    url: string
  } | null>(null)

  const handlePreview = useCallback(
    async (asset: Asset) => {
      if (!projectPath) return
      try {
        const request = create(GetAssetRequestSchema, {
          projectPath,
          filename: asset.filename,
          isShared: true,
        })
        const response = await centyClient.getAsset(request)
        if (response.success && response.data) {
          const bytes = new Uint8Array(response.data)
          const blob = new Blob([bytes], { type: asset.mimeType })
          setPreviewAsset({ asset, url: URL.createObjectURL(blob) })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset')
      }
    },
    [projectPath, setError]
  )

  const closePreview = useCallback(() => {
    if (previewAsset && previewAsset.url) URL.revokeObjectURL(previewAsset.url)
    setPreviewAsset(null)
  }, [previewAsset])

  useEffect(() => {
    return () => {
      if (previewAsset && previewAsset.url)
        URL.revokeObjectURL(previewAsset.url)
    }
  }, [previewAsset])

  return { previewAsset, handlePreview, closePreview }
}

interface SharedAssetsContentProps {
  error: string | null
  loading: boolean
  assets: Asset[]
  deleteConfirm: string | null
  deleting: boolean
  handlePreview: (asset: Asset) => void
  setDeleteConfirm: (v: string | null) => void
  handleDelete: (filename: string) => void
}

function SharedAssetsContent({
  error,
  loading,
  assets,
  deleteConfirm,
  deleting,
  handlePreview,
  setDeleteConfirm,
  handleDelete,
}: SharedAssetsContentProps) {
  return (
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
              onCancelDelete={() => setDeleteConfirm(null)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function SharedAssets() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  useSharedAssetsInit(projectPath, setIsInitialized)
  const { assets, setAssets, loading, error, setError, fetchAssets } =
    useFetchSharedAssets(projectPath, isInitialized)
  const { deleteConfirm, setDeleteConfirm, deleting, handleDelete } =
    useSharedAssetDelete(projectPath, setAssets, setError)
  const { previewAsset, handlePreview, closePreview } = useAssetPreviewState(
    projectPath,
    setError
  )

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
        <SharedAssetsContent
          error={error}
          loading={loading}
          assets={assets}
          deleteConfirm={deleteConfirm}
          deleting={deleting}
          handlePreview={handlePreview}
          setDeleteConfirm={setDeleteConfirm}
          handleDelete={handleDelete}
        />
      )}
      {previewAsset && (
        <AssetPreviewModal previewAsset={previewAsset} onClose={closePreview} />
      )}
    </div>
  )
}
