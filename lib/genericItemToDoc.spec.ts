import { describe, it, expect } from 'vitest'
import { create } from '@bufbuild/protobuf'
import { genericItemToDoc } from './genericItemToDoc'
import { GenericItemSchema, GenericItemMetadataSchema } from '@/gen/centy_pb'

describe('genericItemToDoc', () => {
  it('converts a GenericItem with full metadata to a Doc', () => {
    const item = create(GenericItemSchema, {
      id: 'getting-started',
      title: 'Getting Started',
      body: '# Hello World',
      metadata: create(GenericItemMetadataSchema, {
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        deletedAt: '',
        customFields: {
          is_org_doc: 'false',
          org_slug: '',
        },
      }),
    })

    const doc = genericItemToDoc(item)

    expect(doc.slug).toBe('getting-started')
    expect(doc.title).toBe('Getting Started')
    expect(doc.content).toBe('# Hello World')
    expect(doc.metadata && doc.metadata.createdAt).toBe('2024-01-01T00:00:00Z')
    expect(doc.metadata && doc.metadata.isOrgDoc).toBe(false)
  })

  it('converts a GenericItem without metadata gracefully', () => {
    const item = create(GenericItemSchema, {
      id: 'empty-doc',
      title: 'Empty',
      body: '',
    })

    const doc = genericItemToDoc(item)

    expect(doc.slug).toBe('empty-doc')
    expect(doc.metadata && doc.metadata.createdAt).toBe('')
    expect(doc.metadata && doc.metadata.orgSlug).toBe('')
  })
})
