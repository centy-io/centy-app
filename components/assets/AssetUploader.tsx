'use client'

import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  AddAssetRequestSchema,
  DeleteAssetRequestSchema,
  GetAssetRequestSchema,
  type Asset,
} from '@/gen/centy_pb'

// Allowed MIME types
const ALLOWED_TYPES: Record<string, 'image' | 'video' | 'pdf'> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'application/pdf': 'pdf',
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export interface PendingAsset {
  id: string
  file: File
  preview?: string
  status: 'pending' | 'uploading' | 'error'
  error?: string
}

export interface AssetUploaderHandle {
  uploadAllPending: (targetId: string, isPrUpload?: boolean) => Promise<boolean>
}

interface AssetUploaderProps {
  projectPath: string
  issueId?: string
  prId?: string
  onAssetsChange?: (assets: Asset[]) => void
  onPendingChange?: (pending: PendingAsset[]) => void
  initialAssets?: Asset[]
  mode: 'create' | 'edit'
}

function validateFile(file: File): string | null {
  if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
    return `Unsupported file type: ${file.type}`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 50MB)`
  }
  return null
}

function useAssetUpload(
  projectPath: string,
  onAssetsChange?: (assets: Asset[]) => void,
  onPendingChange?: (pending: PendingAsset[]) => void
) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])

  const uploadAsset = useCallback(
    async (pending: PendingAsset, uploadTargetId: string): Promise<boolean> => {
      try {
        const arrayBuffer = await pending.file.arrayBuffer()
        const request = create(AddAssetRequestSchema, {
          projectPath,
          issueId: uploadTargetId,
          filename: pending.file.name,
          data: new Uint8Array(arrayBuffer),
        })

        const response = await centyClient.addAsset(request)

        if (response.success && response.asset) {
          setAssets(prev => {
            const updated = [...prev, response.asset!]
            if (onAssetsChange) onAssetsChange(updated)
            return updated
          })
          setPendingAssets(prev => {
            const updated = prev.filter(p => p.id !== pending.id)
            if (onPendingChange) onPendingChange(updated)
            return updated
          })
          if (pending.preview) URL.revokeObjectURL(pending.preview)
          return true
        } else {
          setPendingAssets(prev =>
            prev.map(p =>
              p.id === pending.id
                ? {
                    ...p,
                    status: 'error' as const,
                    error: response.error || 'Upload failed',
                  }
                : p
            )
          )
          return false
        }
      } catch (err) {
        setPendingAssets(prev =>
          prev.map(p =>
            p.id === pending.id
              ? {
                  ...p,
                  status: 'error' as const,
                  error: err instanceof Error ? err.message : 'Upload failed',
                }
              : p
          )
        )
        return false
      }
    },
    [projectPath, onAssetsChange, onPendingChange]
  )

  return { assets, setAssets, pendingAssets, setPendingAssets, uploadAsset }
}

function useAssetActions(
  projectPath: string,
  targetId: string | undefined,
  onAssetsChange?: (assets: Asset[]) => void,
  onPendingChange?: (pending: PendingAsset[]) => void,
  setAssets?: React.Dispatch<React.SetStateAction<Asset[]>>,
  pendingAssets?: PendingAsset[],
  setPendingAssets?: React.Dispatch<React.SetStateAction<PendingAsset[]>>
) {
  const [error, setError] = useState<string | null>(null)

  const removeAsset = useCallback(
    async (filename: string) => {
      if (!targetId) return

      try {
        const request = create(DeleteAssetRequestSchema, {
          projectPath,
          issueId: targetId,
          filename,
        })
        const response = await centyClient.deleteAsset(request)

        if (response.success) {
          setAssets!(prev => {
            const updated = prev.filter(a => a.filename !== filename)
            if (onAssetsChange) onAssetsChange(updated)
            return updated
          })
        } else {
          setError(response.error || 'Failed to remove asset')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove asset')
      }
    },
    [projectPath, targetId, onAssetsChange, setAssets]
  )

  const removePending = useCallback(
    (pendingId: string) => {
      const pending = pendingAssets!.find(p => p.id === pendingId)
      if (pending && pending.preview) URL.revokeObjectURL(pending.preview)
      setPendingAssets!(prev => {
        const updated = prev.filter(p => p.id !== pendingId)
        if (onPendingChange) onPendingChange(updated)
        return updated
      })
    },
    [pendingAssets, onPendingChange, setPendingAssets]
  )

  return { error, setError, removeAsset, removePending }
}

function DropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickBrowse,
  fileInputRef,
  onFilesSelected,
}: {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClickBrowse: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFilesSelected: (files: FileList) => void
}) {
  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClickBrowse}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,application/pdf"
        onChange={e => e.target.files && onFilesSelected(e.target.files)}
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
  )
}

function useHandleFiles(
  mode: 'create' | 'edit',
  targetId: string | undefined,
  onPendingChange: ((pending: PendingAsset[]) => void) | undefined,
  uploadAsset: (
    pending: PendingAsset,
    uploadTargetId: string
  ) => Promise<boolean>,
  setError: (error: string | null) => void,
  setPendingAssets: React.Dispatch<React.SetStateAction<PendingAsset[]>>
) {
  return useCallback(
    async (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }

        const preview = file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined
        const pending: PendingAsset = {
          id: crypto.randomUUID(),
          file,
          preview,
          status: mode === 'edit' && targetId ? 'uploading' : 'pending',
        }

        setPendingAssets(prev => {
          const updated = [...prev, pending]
          if (onPendingChange) onPendingChange(updated)
          return updated
        })

        if (mode === 'edit' && targetId) {
          await uploadAsset(pending, targetId)
        }
      }
    },
    [mode, targetId, onPendingChange, uploadAsset, setError, setPendingAssets]
  )
}

function useUploadAllPending(
  pendingAssets: PendingAsset[],
  uploadAsset: (
    pending: PendingAsset,
    uploadTargetId: string
  ) => Promise<boolean>,
  setPendingAssets: React.Dispatch<React.SetStateAction<PendingAsset[]>>
) {
  return useCallback(
    async (uploadTargetId: string): Promise<boolean> => {
      let allSuccess = true
      for (const pending of pendingAssets.filter(p => p.status === 'pending')) {
        setPendingAssets(prev =>
          prev.map(p =>
            p.id === pending.id ? { ...p, status: 'uploading' as const } : p
          )
        )
        if (!(await uploadAsset(pending, uploadTargetId))) allSuccess = false
      }
      return allSuccess
    },
    [pendingAssets, uploadAsset, setPendingAssets]
  )
}

function useDragHandlers(handleFiles: (files: FileList | File[]) => void) {
  const [isDragging, setIsDragging] = useState(false)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return { isDragging, onDragOver, onDragLeave, onDrop }
}

function AssetErrorBanner({
  error,
  onDismiss,
}: {
  error: string | null
  onDismiss: () => void
}) {
  if (!error) return null
  return (
    <div className="asset-error">
      {error}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  )
}

function AssetGrid({
  assets,
  pendingAssets,
  projectPath,
  issueId,
  removeAsset,
  removePending,
}: {
  assets: Asset[]
  pendingAssets: PendingAsset[]
  projectPath: string
  issueId?: string
  removeAsset: (filename: string) => void
  removePending: (id: string) => void
}) {
  if (assets.length === 0 && pendingAssets.length === 0) return null
  return (
    <div className="asset-grid">
      {assets.map(asset => (
        <AssetPreviewItem
          key={asset.filename}
          asset={asset}
          projectPath={projectPath}
          issueId={issueId!}
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
  )
}

function useAssetUploaderSetup(
  projectPath: string,
  targetId: string | undefined,
  onAssetsChange: ((assets: Asset[]) => void) | undefined,
  onPendingChange: ((pending: PendingAsset[]) => void) | undefined,
  initialAssets: Asset[],
  mode: 'create' | 'edit'
) {
  const { assets, setAssets, pendingAssets, setPendingAssets, uploadAsset } =
    useAssetUpload(projectPath, onAssetsChange, onPendingChange)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { error, setError, removeAsset, removePending } = useAssetActions(
    projectPath,
    targetId,
    onAssetsChange,
    onPendingChange,
    setAssets,
    pendingAssets,
    setPendingAssets
  )

  const initialAssetsKey = JSON.stringify(initialAssets.map(a => a.filename))
  useEffect(() => {
    setAssets(initialAssets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAssetsKey])

  const handleFiles = useHandleFiles(
    mode,
    targetId,
    onPendingChange,
    uploadAsset,
    setError,
    setPendingAssets
  )
  const uploadAllPending = useUploadAllPending(
    pendingAssets,
    uploadAsset,
    setPendingAssets
  )

  useEffect(() => {
    return () => {
      pendingAssets.forEach(p => {
        if (p.preview) URL.revokeObjectURL(p.preview)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    assets,
    pendingAssets,
    fileInputRef,
    error,
    setError,
    removeAsset,
    removePending,
    handleFiles,
    uploadAllPending,
  }
}

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
  const setup = useAssetUploaderSetup(
    projectPath,
    targetId,
    onAssetsChange,
    onPendingChange,
    initialAssets,
    mode
  )
  const { isDragging, onDragOver, onDragLeave, onDrop } = useDragHandlers(
    setup.handleFiles
  )

  useImperativeHandle(ref, () => ({ uploadAllPending: setup.uploadAllPending }))

  return (
    <div className="asset-uploader">
      <DropZone
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClickBrowse={() => {
          if (setup.fileInputRef.current) setup.fileInputRef.current.click()
        }}
        fileInputRef={setup.fileInputRef}
        onFilesSelected={setup.handleFiles}
      />
      <AssetErrorBanner
        error={setup.error}
        onDismiss={() => setup.setError(null)}
      />
      <AssetGrid
        assets={setup.assets}
        pendingAssets={setup.pendingAssets}
        projectPath={projectPath}
        issueId={issueId}
        removeAsset={setup.removeAsset}
        removePending={setup.removePending}
      />
    </div>
  )
})

// Asset Preview for saved assets
interface AssetPreviewItemProps {
  asset: Asset
  projectPath: string
  issueId: string
  onRemove: () => void
}

function useAssetPreview(asset: Asset, projectPath: string, issueId: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadPreview = async () => {
      if (
        asset.mimeType.startsWith('image/') ||
        asset.mimeType.startsWith('video/')
      ) {
        try {
          const request = create(GetAssetRequestSchema, {
            projectPath,
            issueId,
            filename: asset.filename,
          })
          const response = await centyClient.getAsset(request)
          if (mounted && response.data) {
            const bytes = new Uint8Array(response.data)
            const blob = new Blob([bytes], { type: asset.mimeType })
            setPreviewUrl(URL.createObjectURL(blob))
          }
        } catch (err) {
          console.error('Failed to load asset preview:', err)
        }
      }
      if (mounted) setLoading(false)
    }
    loadPreview()

    return () => {
      mounted = false
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [asset, projectPath, issueId]) // eslint-disable-line react-hooks/exhaustive-deps

  return { previewUrl, loading }
}

function AssetPreviewItem({
  asset,
  projectPath,
  issueId,
  onRemove,
}: AssetPreviewItemProps) {
  const { previewUrl, loading } = useAssetPreview(asset, projectPath, issueId)

  const type = asset.mimeType.startsWith('image/')
    ? 'image'
    : asset.mimeType.startsWith('video/')
      ? 'video'
      : 'pdf'

  return (
    <div className="asset-preview">
      {loading ? (
        <div className="asset-loading">Loading...</div>
      ) : type === 'image' && previewUrl ? (
        <img
          src={previewUrl}
          alt={asset.filename}
          className="asset-preview-image"
        />
      ) : type === 'video' && previewUrl ? (
        <video src={previewUrl} className="asset-preview-video" muted />
      ) : (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">PDF</span>
          <span className="asset-preview-pdf-name">{asset.filename}</span>
        </div>
      )}
      <div className="asset-overlay">
        <button
          className="asset-remove-btn"
          onClick={onRemove}
          title="Remove asset"
        >
          x
        </button>
      </div>
    </div>
  )
}

// Pending Asset Preview
interface PendingAssetPreviewItemProps {
  pending: PendingAsset
  onRemove: () => void
}

function PendingAssetPreviewItem({
  pending,
  onRemove,
}: PendingAssetPreviewItemProps) {
  const type = pending.file.type.startsWith('image/')
    ? 'image'
    : pending.file.type.startsWith('video/')
      ? 'video'
      : 'pdf'

  return (
    <div className={`asset-preview pending ${pending.status}`}>
      {type === 'image' && pending.preview ? (
        <img
          src={pending.preview}
          alt={pending.file.name}
          className="asset-preview-image"
        />
      ) : type === 'video' ? (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">VID</span>
          <span className="asset-preview-pdf-name">{pending.file.name}</span>
        </div>
      ) : (
        <div className="asset-preview-pdf">
          <span className="asset-preview-pdf-icon">PDF</span>
          <span className="asset-preview-pdf-name">{pending.file.name}</span>
        </div>
      )}

      {pending.status === 'error' && (
        <div className="asset-error-badge">
          {pending.error || 'Upload failed'}
        </div>
      )}

      <div className="asset-overlay">
        <button className="asset-remove-btn" onClick={onRemove} title="Remove">
          x
        </button>
      </div>
    </div>
  )
}
