export interface PendingAsset {
  id: string
  file: File
  preview?: string
  status: 'pending' | 'uploading' | 'error'
  error?: string
}
