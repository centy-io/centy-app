import { describe, it, expect } from 'vitest'
import { filterAndMap } from './filterAndMap'
import type { GenericItem, Link as LinkType } from '@/gen/centy_pb'

const makeItem = (
  id: string,
  title: string,
  itemType: string,
  displayNumber?: number
): GenericItem =>
  ({
    id,
    itemType,
    title,
    body: '',
    metadata: {
      displayNumber: displayNumber ?? 0,
      status: 'open',
      priority: 2,
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
      customFields: {},
      $typeName: 'centy.v1.GenericItemMetadata' as const,
      $unknown: undefined,
    },
    $typeName: 'centy.v1.GenericItem' as const,
    $unknown: undefined,
  }) as GenericItem

const makeLink = (targetId: string, linkType: string): LinkType =>
  ({
    targetId,
    linkType,
    sourceId: 'source',
    $typeName: 'centy.v1.Link' as const,
    $unknown: undefined,
  }) as LinkType

describe('filterAndMap', () => {
  it('excludes the current entity from results', () => {
    const items = [
      makeItem('self', 'Self', 'issues', 1),
      makeItem('other', 'Other', 'issues', 2),
    ]
    const result = filterAndMap(items, 'self', [], 'blocks', '')
    expect(result.map(r => r.id)).toEqual(['other'])
  })

  it('excludes items already linked with the same link type', () => {
    const items = [
      makeItem('linked', 'Linked', 'issues', 1),
      makeItem('unlinked', 'Unlinked', 'issues', 2),
    ]
    const links = [makeLink('linked', 'blocks')]
    const result = filterAndMap(items, 'entity', links, 'blocks', '')
    expect(result.map(r => r.id)).toEqual(['unlinked'])
  })

  it('filters by search query on title', () => {
    const items = [
      makeItem('a', 'Alpha Issue', 'issues', 1),
      makeItem('b', 'Beta Issue', 'issues', 2),
    ]
    const result = filterAndMap(items, 'entity', [], 'blocks', 'alpha')
    expect(result.map(r => r.id)).toEqual(['a'])
  })

  it('maps issues with type issue and docs with type doc', () => {
    const items = [
      makeItem('i1', 'Issue One', 'issues', 1),
      makeItem('d1', 'Doc One', 'docs', 0),
    ]
    const result = filterAndMap(items, 'entity', [], 'blocks', '')
    expect(result[0].type).toBe('issue')
    expect(result[1].type).toBe('doc')
  })

  it('includes displayNumber for issues and omits it for items with no number', () => {
    const items = [
      makeItem('i1', 'Issue One', 'issues', 5),
      makeItem('d1', 'Doc One', 'docs', 0),
    ]
    const result = filterAndMap(items, 'entity', [], 'blocks', '')
    expect(result[0].displayNumber).toBe(5)
    expect(result[1].displayNumber).toBeUndefined()
  })
})
