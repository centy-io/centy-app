import { describe, it, expect } from 'vitest'
import { parseSortParam } from './parseSortParam'
import { DEFAULT_SETTINGS } from './useIssueTableSettings.types'

describe('parseSortParam', () => {
  it('returns default settings when value is null', () => {
    expect(parseSortParam(null)).toEqual(DEFAULT_SETTINGS.sorting)
  })

  it('returns default settings when value is empty string', () => {
    expect(parseSortParam('')).toEqual(DEFAULT_SETTINGS.sorting)
  })

  it('parses desc sort', () => {
    expect(parseSortParam('createdAt:desc')).toEqual([
      { id: 'createdAt', desc: true },
    ])
  })

  it('parses asc sort', () => {
    expect(parseSortParam('title:asc')).toEqual([{ id: 'title', desc: false }])
  })

  it('parses multiple sort fields', () => {
    expect(parseSortParam('priority:asc,createdAt:desc')).toEqual([
      { id: 'priority', desc: false },
      { id: 'createdAt', desc: true },
    ])
  })
})
