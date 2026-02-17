import type { PendingAsset } from './types'
import { ALLOWED_TYPES, MAX_FILE_SIZE } from './types'

export function validateFile(file: File): string | null {
  if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
    return `Unsupported file type: ${file.type}`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 50MB)`
  }
  return null
}

interface HandleFilesParams {
  files: FileList | File[]
  mode: 'create' | 'edit'
  targetId: string | undefined
  setError: (e: string | null) => void
  setPendingAssets: (fn: (prev: PendingAsset[]) => PendingAsset[]) => void
  onPendingChange?: (assets: PendingAsset[]) => void
  uploadAsset: (pending: PendingAsset, targetId: string) => Promise<boolean>
}

export async function processFiles(params: HandleFilesParams) {
  const {
    files,
    mode,
    targetId,
    setError,
    setPendingAssets,
    onPendingChange,
    uploadAsset,
  } = params
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
      onPendingChange?.(updated)
      return updated
    })
    if (mode === 'edit' && targetId) {
      await uploadAsset(pending, targetId)
    }
  }
}
