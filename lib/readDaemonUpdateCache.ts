const CACHE_KEY = 'centy:daemonUpdateCache'

interface DaemonUpdateCache {
  daemonVersion: string
  hasUpdate: boolean
}

export function readDaemonUpdateCache(daemonVersion: string): boolean | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: DaemonUpdateCache = JSON.parse(raw)
    if (cached.daemonVersion !== daemonVersion) return null
    return cached.hasUpdate
  } catch {
    return null
  }
}
