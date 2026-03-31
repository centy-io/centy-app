import { describe, it, expect } from 'vitest'
import { getSortIndicator } from './getSortIndicator'

describe('getSortIndicator', () => {
  it('returns up arrow for asc', () => {
    expect(getSortIndicator('asc')).toBe(' ▲')
  })
  it('returns down arrow for desc', () => {
    expect(getSortIndicator('desc')).toBe(' ▼')
  })
  it('returns empty string for false', () => {
    expect(getSortIndicator(false)).toBe('')
  })
})
