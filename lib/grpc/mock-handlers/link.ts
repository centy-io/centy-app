'use client'

import { DEMO_LINKS } from '../demo-data'
import type {
  ListLinksRequest,
  ListLinksResponse,
  GetAvailableLinkTypesRequest,
  GetAvailableLinkTypesResponse,
} from '@/gen/centy_pb'

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

export async function getAvailableLinkTypes(
  _request: GetAvailableLinkTypesRequest
): Promise<GetAvailableLinkTypesResponse> {
  return {
    $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
    linkTypes: [
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'blocks',
        inverse: 'blocked-by',
        description: 'Blocks another issue from being worked on',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'fixes',
        inverse: 'fixed-by',
        description: 'Fixes the linked issue',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'implements',
        inverse: 'implemented-by',
        description: 'Implements a feature or requirement',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'relates-to',
        inverse: 'relates-to',
        description: 'Related to another issue',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'duplicates',
        inverse: 'duplicated-by',
        description: 'Duplicates another issue',
        isBuiltin: true,
      },
    ],
  }
}
