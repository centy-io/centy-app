'use client'

import { DEMO_LINKS } from '../demo-data'
import type { ListLinksRequest, ListLinksResponse } from '@/gen/centy_pb'

export async function listLinks(
  request: ListLinksRequest
): Promise<ListLinksResponse> {
  const links = DEMO_LINKS.filter(link => link.targetId === request.entityId)

  return {
    $typeName: 'centy.v1.ListLinksResponse',
    links,
    totalCount: links.length,
    success: true,
    error: '',
  }
}
