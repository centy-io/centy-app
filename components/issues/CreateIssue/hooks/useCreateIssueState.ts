import { useState, useRef } from 'react'
import { useStateManager } from '@/lib/state'
import type {
  AssetUploaderHandle,
  PendingAsset,
} from '@/components/assets/AssetUploader'

export function useCreateIssueState() {
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const assetUploaderRef = useRef<AssetUploaderHandle>(null)
  return {
    stateOptions,
    status,
    setStatus,
    loading,
    setLoading,
    error,
    setError,
    pendingAssets,
    setPendingAssets,
    assetUploaderRef,
  }
}
