import type { Config } from '@/gen/centy_pb'

// Snapshot type for useSyncExternalStore - must be immutable and cached
export interface ConfigSnapshot {
  config: Config | null
  loading: boolean
  error: string | null
}

// Internal cache state per project path
export interface CacheState {
  config: Config | null
  loading: boolean
  error: string | null
  listeners: Set<() => void>
  // Cached snapshot - only recreated when state changes
  snapshot: ConfigSnapshot
}

// Default snapshot for server-side rendering - must be a constant to avoid infinite loops
export const DEFAULT_SNAPSHOT: ConfigSnapshot = {
  config: null,
  loading: false,
  error: null,
}
