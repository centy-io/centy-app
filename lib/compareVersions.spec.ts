import { describe, it, expect } from 'vitest'
import { isNewerVersion } from './compareVersions'

describe('isNewerVersion', () => {
  it('returns true when versionB is newer than versionA', () => {
    expect(isNewerVersion('0.3.1', '0.3.2')).toBe(true)
    expect(isNewerVersion('0.3.1', '0.4.0')).toBe(true)
    expect(isNewerVersion('0.3.1', '1.0.0')).toBe(true)
  })

  it('returns false when versionB is older than versionA', () => {
    expect(isNewerVersion('0.3.2', '0.3.1')).toBe(false)
    expect(isNewerVersion('1.0.0', '0.9.9')).toBe(false)
  })

  it('returns false when versions are equal', () => {
    expect(isNewerVersion('0.3.1', '0.3.1')).toBe(false)
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false)
  })

  it('handles v-prefixed versions', () => {
    expect(isNewerVersion('v0.3.1', 'v0.3.2')).toBe(true)
    expect(isNewerVersion('v0.3.1', '0.3.2')).toBe(true)
    expect(isNewerVersion('0.3.1', 'v0.3.2')).toBe(true)
  })

  it('handles missing patch component', () => {
    expect(isNewerVersion('0.3', '0.3.1')).toBe(true)
    expect(isNewerVersion('0.3.1', '0.4')).toBe(true)
  })
})
