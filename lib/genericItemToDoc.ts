import { create } from '@bufbuild/protobuf'
import type { GenericItem } from '@/gen/centy_pb'
import { DocSchema, DocMetadataSchema } from '@/gen/centy_pb'
import type { Doc } from '@/gen/centy_pb'

/**
 * Convert a GenericItem to the legacy Doc type.
 * Docs use item.id as slug and item.body as content.
 */
export function genericItemToDoc(item: GenericItem): Doc {
  const meta = item.metadata
  const cf = (meta && meta.customFields) || {}

  return create(DocSchema, {
    slug: item.id,
    title: item.title,
    content: item.body,
    metadata: create(DocMetadataSchema, {
      createdAt: (meta && meta.createdAt) || '',
      updatedAt: (meta && meta.updatedAt) || '',
      deletedAt: (meta && meta.deletedAt) || '',
      isOrgDoc: cf['is_org_doc'] === 'true',
      orgSlug: cf['org_slug'] || '',
    }),
  })
}
