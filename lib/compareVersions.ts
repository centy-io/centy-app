/**
 * Compares two semver version strings.
 * Returns true if versionB is strictly greater than versionA.
 */
export function isNewerVersion(versionA: string, versionB: string): boolean {
  const normalize = (v: string) => v.replace(/^v/, '')
  const aQueue = normalize(versionA).split('.').map(Number)
  const bQueue = normalize(versionB).split('.').map(Number)

  while (aQueue.length > 0 || bQueue.length > 0) {
    const a = aQueue.length > 0 ? aQueue.shift()! : 0
    const b = bQueue.length > 0 ? bQueue.shift()! : 0
    if (b > a) return true
    if (b < a) return false
  }

  return false
}
