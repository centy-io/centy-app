import { describe, it, expect } from 'vitest'
import { parseFilterParam } from './parseFilterParam'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

describe('parseFilterParam', () => {
  it('returns default settings when value is null', () => {
    expect(parseFilterParam(null)).toEqual(DEFAULT_SETTINGS.columnFilters)
  })

  it('returns default settings when value is empty string', () => {
    expect(parseFilterParam('')).toEqual(DEFAULT_SETTINGS.columnFilters)
  })

  it('returns default settings on invalid JSON', () => {
    expect(parseFilterParam('not-json')).toEqual(DEFAULT_SETTINGS.columnFilters)
  })

  it('parses $in operator into array value', () => {
    const mql = JSON.stringify({
      status: { $in: ['open', 'in-progress'] },
    })
    expect(parseFilterParam(mql)).toEqual([
      { id: 'status', value: ['open', 'in-progress'] },
    ])
  })

  it('parses scalar value directly', () => {
    const mql = JSON.stringify({ priority: 'high' })
    expect(parseFilterParam(mql)).toEqual([{ id: 'priority', value: 'high' }])
  })

  it('parses multiple filter fields', () => {
    const mql = JSON.stringify({
      status: { $in: ['open'] },
      priority: 'high',
    })
    const result = parseFilterParam(mql)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ id: 'status', value: ['open'] })
    expect(result).toContainEqual({ id: 'priority', value: 'high' })
  })
})
