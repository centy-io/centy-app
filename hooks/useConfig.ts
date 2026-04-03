'use client'

import { useEffect, useCallback, useSyncExternalStore } from 'react'
import type { ConfigSnapshot } from './useConfig.types'
import { createConfigStore } from './createConfigStore'
import { usePathContext } from '@/components/providers/PathContextProvider'

const DEFAULT_SNAPSHOT: ConfigSnapshot = {
  config: null,
  loading: false,
  error: null,
}

const configStore = createConfigStore()

export function useConfig() {
  const { projectPath, isInitialized } = usePathContext()

  const snapshot = useSyncExternalStore(
    useCallback(
      listener => configStore.subscribe(projectPath, listener),
      [projectPath]
    ),
    useCallback(() => configStore.getSnapshot(projectPath), [projectPath]),
    () => DEFAULT_SNAPSHOT
  )

  const reload = useCallback(async () => {
    if (!projectPath) return
    await configStore.fetchConfig(projectPath, true)
  }, [projectPath])

  useEffect(() => {
    if (isInitialized === true && projectPath) {
      void configStore.fetchConfig(projectPath)
    }
  }, [projectPath, isInitialized])

  return {
    config: snapshot.config,
    loading: snapshot.loading,
    error: snapshot.error,
    reload,
  }
}
