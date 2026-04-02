import { describe, it, expect } from 'vitest'
import { getCellClassName } from './tableHelpers'

describe('getCellClassName', () => {
  it('returns org-name for name column', () => {
    expect(getCellClassName('name')).toBe('org-name')
  })
  it('returns org-slug for slug column', () => {
    expect(getCellClassName('slug')).toBe('org-slug')
  })
  it('returns empty string for unknown column', () => {
    expect(getCellClassName('unknown')).toBe('')
  })
})
