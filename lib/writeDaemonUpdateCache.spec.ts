import { describe, it, expect, beforeEach } from 'vitest'
import { writeDaemonUpdateCache } from './writeDaemonUpdateCache'

const CACHE_KEY = 'centy:daemonUpdateCache'

describe('writeDaemonUpdateCache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('writes the daemon version and hasUpdate to localStorage', () => {
    writeDaemonUpdateCache('1.0.0', true)
    const raw = localStorage.getItem(CACHE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed).toEqual({ daemonVersion: '1.0.0', hasUpdate: true })
  })

  it('overwrites a previous cache entry', () => {
    writeDaemonUpdateCache('1.0.0', true)
    writeDaemonUpdateCache('1.0.1', false)
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = JSON.parse(raw!)
    expect(parsed).toEqual({ daemonVersion: '1.0.1', hasUpdate: false })
  })
})
