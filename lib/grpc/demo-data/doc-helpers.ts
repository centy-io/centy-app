'use client'

import { type DocMetadata } from '@/gen/centy_pb'

// Helper to create doc metadata
export function createDocMetadata(
  createdAt: string,
  updatedAt: string
): DocMetadata {
  return {
    $typeName: 'centy.v1.DocMetadata',
    createdAt,
    updatedAt,
    deletedAt: '',
    isOrgDoc: false,
    orgSlug: '',
  }
}
