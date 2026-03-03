import { describe, it, expect } from 'vitest'
import { serializeFilterParam } from './serializeFilterParam'
import { parseFilterParam } from './parseFilterParam'

describe('serializeFilterParam', () => {
  it('returns null for empty filters', () => {
    expect(serializeFilterParam([])).toBeNull()
  })

  it('serializes array value as $in operator', () => {
    const result = serializeFilterParam([
      { id: 'status', value: ['open', 'in-progress'] },
    ])
    expect(JSON.parse(result!)).toEqual({
      status: { $in: ['open', 'in-progress'] },
    })
  })

  it('serializes scalar value directly', () => {
    const result = serializeFilterParam([{ id: 'priority', value: 'high' }])
    expect(JSON.parse(result!)).toEqual({ priority: 'high' })
  })

  it('round-trips through parse and serialize', () => {
    const filters = [
      { id: 'status', value: ['open', 'in-progress'] },
      { id: 'priority', value: 'high' },
    ]
    const serialized = serializeFilterParam(filters)
    const parsed = parseFilterParam(serialized)
    expect(parsed).toHaveLength(2)
    expect(parsed).toContainEqual({
      id: 'status',
      value: ['open', 'in-progress'],
    })
    expect(parsed).toContainEqual({ id: 'priority', value: 'high' })
  })
})
