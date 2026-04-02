import type { ConfigSnapshot } from './ConfigSnapshot'
import type { Config } from '@/gen/centy_pb'

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
