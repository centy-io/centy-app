'use client'

import { useEffect, useCallback, useSyncExternalStore } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetConfigRequestSchema } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'
import type { ConfigSnapshot, CacheState } from './useConfig.types'
import { DEFAULT_SNAPSHOT } from './useConfig.types'

// Cache config per project path
const configCache = new Map<string, CacheState>()

function createSnapshot(cache: CacheState): ConfigSnapshot {
  return {
    config: cache.config,
    loading: cache.loading,
    error: cache.error,
  }
}

function getOrCreateCache(projectPath: string): CacheState {
  if (!configCache.has(projectPath)) {
    const initialSnapshot: ConfigSnapshot = {
      config: null,
      loading: false,
      error: null,
    }
    configCache.set(projectPath, {
      config: null,
      loading: false,
      error: null,
      listeners: new Set(),
      snapshot: initialSnapshot,
    })
  }
  return configCache.get(projectPath)!
}

// Return the cached snapshot - must return same reference if state hasn't changed
function getSnapshot(projectPath: string): ConfigSnapshot {
  const cache = getOrCreateCache(projectPath)
  return cache.snapshot
}

function subscribe(projectPath: string, listener: () => void) {
  const cache = getOrCreateCache(projectPath)
  cache.listeners.add(listener)
  return () => cache.listeners.delete(listener)
}

function notifyListeners(projectPath: string) {
  const cache = configCache.get(projectPath)
  if (cache) {
    // Create a new snapshot object so useSyncExternalStore detects the change
    cache.snapshot = createSnapshot(cache)
    cache.listeners.forEach(listener => listener())
  }
}

async function fetchConfig(projectPath: string, force = false): Promise<void> {
  if (!projectPath) return

  const cache = getOrCreateCache(projectPath)

  // Skip if already loading, or if has data and not forcing reload
  if (cache.loading || (cache.config && !force)) return

  cache.loading = true
  cache.error = null
  notifyListeners(projectPath)

  try {
    const request = create(GetConfigRequestSchema, {
      projectPath: projectPath.trim(),
    })
    const response = await centyClient.getConfig(request)
    if (response.config) {
      cache.config = response.config
      cache.error = null
    } else {
      cache.error = response.error || 'Failed to load config'
    }
  } catch (err) {
    cache.error = err instanceof Error ? err.message : 'Failed to load config'
  } finally {
    cache.loading = false
    notifyListeners(projectPath)
  }
}

export function useConfig() {
  const { projectPath, isInitialized } = usePathContext()

  const snapshot = useSyncExternalStore(
    useCallback(listener => subscribe(projectPath, listener), [projectPath]),
    useCallback(() => getSnapshot(projectPath), [projectPath]),
    () => DEFAULT_SNAPSHOT
  )

  const reload = useCallback(async () => {
    if (!projectPath) return
    // Force refetch config from daemon
    await fetchConfig(projectPath, true)
  }, [projectPath])

  // Fetch config when project is initialized
  useEffect(() => {
    if (isInitialized === true && projectPath) {
      fetchConfig(projectPath)
    }
  }, [projectPath, isInitialized])

  return {
    config: snapshot.config,
    loading: snapshot.loading,
    error: snapshot.error,
    reload,
  }
}
