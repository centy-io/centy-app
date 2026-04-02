'use client'

import type { GenericItem, Doc } from '@/gen/centy_pb'

export function docToGenericItem(doc: Doc): GenericItem {
  const meta = doc.metadata
  return {
    $typeName: 'centy.v1.GenericItem',
    id: doc.slug,
    itemType: 'docs',
    title: doc.title,
    body: doc.content,
    metadata: {
      $typeName: 'centy.v1.GenericItemMetadata',
      displayNumber: 0,
      status: '',
      priority: 0,
      createdAt: (meta && meta.createdAt) || '',
      updatedAt: (meta && meta.updatedAt) || '',
      deletedAt: (meta && meta.deletedAt) || '',
      customFields: {
        is_org_doc: String((meta && meta.isOrgDoc) || false),
        org_slug: (meta && meta.orgSlug) || '',
      },
      tags: [],
    },
  }
}
