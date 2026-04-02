const CACHE_KEY = 'centy:daemonUpdateCache'

interface DaemonUpdateCache {
  daemonVersion: string
  hasUpdate: boolean
}

export function writeDaemonUpdateCache(
  daemonVersion: string,
  hasUpdate: boolean
): void {
  try {
    const entry: DaemonUpdateCache = { daemonVersion, hasUpdate }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // ignore storage errors
  }
}
