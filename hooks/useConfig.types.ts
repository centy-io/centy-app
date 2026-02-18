import type { Config } from '@/gen/centy_pb'

/**
 * Snapshot type for useSyncExternalStore - must be immutable and cached
 */
export interface ConfigSnapshot {
  config: Config | null
  loading: boolean
  error: string | null
}

/**
 * Internal cache state per project path
 */
export interface CacheState {
  config: Config | null
  loading: boolean
  error: string | null
  listeners: Set<() => void>
  snapshot: ConfigSnapshot
}
