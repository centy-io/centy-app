import { describe, it, expect } from 'vitest'
import { getColumnFilterValue } from './getColumnFilterValue'

describe('getColumnFilterValue', () => {
  it('returns string filter value', () => {
    const header = { column: { getFilterValue: () => 'test' } }
    expect(getColumnFilterValue(header)).toBe('test')
  })

  it('returns empty string for non-string filter value', () => {
    const header = { column: { getFilterValue: () => 42 } }
    expect(getColumnFilterValue(header)).toBe('')
  })
})
