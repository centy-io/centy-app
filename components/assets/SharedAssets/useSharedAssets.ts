'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Asset } from '@/gen/centy_pb'
import { checkProjectInitialized, fetchSharedAssets } from './sharedAssetsApi'
import { useAssetActions } from './useAssetActions'

export function useSharedAssets(
  projectPath: string,
  isInitialized: boolean | null,
  setIsInitialized: (value: boolean | null) => void
) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actions = useAssetActions(projectPath, setAssets, setError)

  const checkInit = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }
      try {
        setIsInitialized(await checkProjectInitialized(path))
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  const fetchAssets = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      setAssets(await fetchSharedAssets(projectPath))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    const timeoutId = setTimeout(() => checkInit(projectPath), 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInit])

  useEffect(() => {
    if (isInitialized === true) fetchAssets()
  }, [isInitialized, fetchAssets])

  return {
    assets,
    loading,
    error,
    fetchAssets,
    ...actions,
  }
}
