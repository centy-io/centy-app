import type { Asset } from '@/gen/centy_pb'

// Allowed MIME types
export const ALLOWED_TYPES: Record<string, 'image' | 'video' | 'pdf'> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'application/pdf': 'pdf',
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

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

export interface AssetUploaderProps {
  projectPath: string
  issueId?: string
  prId?: string
  onAssetsChange?: (assets: Asset[]) => void
  onPendingChange?: (pending: PendingAsset[]) => void
  initialAssets?: Asset[]
  mode: 'create' | 'edit'
}
