'use client'

import { useEffect, useCallback, useSyncExternalStore } from 'react'
import { create } from '@bufbuild/protobuf'
import type { ConfigSnapshot, CacheState } from './useConfig.types'
import { centyClient } from '@/lib/grpc/client'
import { GetConfigRequestSchema } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'

const configCache = new Map<string, CacheState>()

const DEFAULT_SNAPSHOT: ConfigSnapshot = {
  config: null,
  loading: false,
  error: null,
}

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
  if (!cache) return
  cache.snapshot = createSnapshot(cache)
  cache.listeners.forEach(listener => listener())
}

async function fetchConfig(
  projectPath: string,
  force?: boolean
): Promise<void> {
  if (!projectPath) return

  const cache = getOrCreateCache(projectPath)
  const resolvedForce = force !== undefined ? force : false

  if (cache.loading || (cache.config && !resolvedForce)) return

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
    await fetchConfig(projectPath, true)
  }, [projectPath])

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
