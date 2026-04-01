import { create } from '@bufbuild/protobuf'
import type { ConfigSnapshot, CacheState } from './useConfig.types'
import { centyClient } from '@/lib/grpc/client'
import { GetConfigRequestSchema } from '@/gen/centy_pb'

const DEFAULT_CACHE_STATE = {
  config: null,
  loading: false,
  error: null,
} as const

interface ConfigStore {
  getSnapshot: (projectPath: string) => ConfigSnapshot
  subscribe: (projectPath: string, listener: () => void) => () => void
  fetchConfig: (projectPath: string, force?: boolean) => Promise<void>
}

function buildCacheState(configCache: Map<string, CacheState>) {
  function getOrCreate(projectPath: string): CacheState {
    if (!configCache.has(projectPath)) {
      const snapshot: ConfigSnapshot = { ...DEFAULT_CACHE_STATE }
      configCache.set(projectPath, {
        ...DEFAULT_CACHE_STATE,
        listeners: new Set(),
        snapshot,
      })
    }
    return configCache.get(projectPath)!
  }

  function notify(projectPath: string): void {
    const cache = configCache.get(projectPath)
    if (!cache) return
    cache.snapshot = {
      config: cache.config,
      loading: cache.loading,
      error: cache.error,
    }
    cache.listeners.forEach(listener => listener())
  }

  return { getOrCreate, notify }
}

async function runFetchConfig(
  cache: CacheState,
  projectPath: string,
  notify: (path: string) => void
): Promise<void> {
  cache.loading = true
  cache.error = null
  notify(projectPath)

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
    notify(projectPath)
  }
}

export function createConfigStore(): ConfigStore {
  const configCache = new Map<string, CacheState>()
  const { getOrCreate, notify } = buildCacheState(configCache)

  function getSnapshot(projectPath: string): ConfigSnapshot {
    return getOrCreate(projectPath).snapshot
  }

  function subscribe(projectPath: string, listener: () => void): () => void {
    const cache = getOrCreate(projectPath)
    cache.listeners.add(listener)
    return () => cache.listeners.delete(listener)
  }

  async function fetchConfig(
    projectPath: string,
    force?: boolean
  ): Promise<void> {
    if (!projectPath) return
    const cache = getOrCreate(projectPath)
    const resolvedForce = force !== undefined ? force : false
    if (cache.loading || (cache.config && !resolvedForce)) return
    await runFetchConfig(cache, projectPath, notify)
  }

  return { getSnapshot, subscribe, fetchConfig }
}
