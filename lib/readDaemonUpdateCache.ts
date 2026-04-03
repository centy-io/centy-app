const CACHE_KEY = 'centy:daemonUpdateCache'

interface DaemonUpdateCache {
  daemonVersion: string
  hasUpdate: boolean
}

export function readDaemonUpdateCache(daemonVersion: string): boolean | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: unknown = JSON.parse(raw)
    if (
      typeof cached !== 'object' ||
      cached === null ||
      !('daemonVersion' in cached) ||
      !('hasUpdate' in cached)
    )
      return null
    const daemonVersionValue: unknown = cached.daemonVersion
    const hasUpdateValue: unknown = cached.hasUpdate
    if (daemonVersionValue !== daemonVersion) return null
    if (typeof hasUpdateValue !== 'boolean') return null
    return hasUpdateValue
  } catch {
    return null
  }
}
