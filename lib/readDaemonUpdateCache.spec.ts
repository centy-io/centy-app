import { describe, it, expect, beforeEach } from 'vitest'
import { readDaemonUpdateCache } from './readDaemonUpdateCache'

const CACHE_KEY = 'centy:daemonUpdateCache'

describe('readDaemonUpdateCache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no cache entry exists', () => {
    expect(readDaemonUpdateCache('1.0.0')).toBeNull()
  })

  it('returns null when stored version does not match', () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ daemonVersion: '1.0.0', hasUpdate: true })
    )
    expect(readDaemonUpdateCache('1.0.1')).toBeNull()
  })

  it('returns cached hasUpdate when version matches', () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ daemonVersion: '1.0.0', hasUpdate: true })
    )
    expect(readDaemonUpdateCache('1.0.0')).toBe(true)
  })

  it('returns false when update is not available and version matches', () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ daemonVersion: '1.0.0', hasUpdate: false })
    )
    expect(readDaemonUpdateCache('1.0.0')).toBe(false)
  })

  it('returns null when stored JSON is invalid', () => {
    localStorage.setItem(CACHE_KEY, 'not-json')
    expect(readDaemonUpdateCache('1.0.0')).toBeNull()
  })
})
