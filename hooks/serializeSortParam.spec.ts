import { describe, it, expect } from 'vitest'
import { serializeSortParam } from './serializeSortParam'
import { parseSortParam } from './parseSortParam'

describe('serializeSortParam', () => {
  it('returns null for empty sorting', () => {
    expect(serializeSortParam([])).toBeNull()
  })

  it('serializes desc sort', () => {
    expect(serializeSortParam([{ id: 'createdAt', desc: true }])).toBe(
      'createdAt:desc'
    )
  })

  it('serializes asc sort', () => {
    expect(serializeSortParam([{ id: 'title', desc: false }])).toBe('title:asc')
  })

  it('serializes multiple sort fields', () => {
    expect(
      serializeSortParam([
        { id: 'priority', desc: false },
        { id: 'createdAt', desc: true },
      ])
    ).toBe('priority:asc,createdAt:desc')
  })

  it('round-trips through parse and serialize', () => {
    const sorting = [{ id: 'createdAt', desc: true }]
    const serialized = serializeSortParam(sorting)
    expect(parseSortParam(serialized)).toEqual(sorting)
  })
})
