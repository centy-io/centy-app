'use client'

import type {
  GetAvailableLinkTypesRequest,
  GetAvailableLinkTypesResponse,
} from '@/gen/centy_pb'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getAvailableLinkTypes(
  _request: GetAvailableLinkTypesRequest
): Promise<GetAvailableLinkTypesResponse> {
  return {
    $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
    linkTypes: [
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'blocks',
        description: 'Blocks another issue from being worked on',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'fixes',
        description: 'Fixes the linked issue',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'implements',
        description: 'Implements a feature or requirement',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'relates-to',
        description: 'Related to another issue',
        isBuiltin: true,
      },
      {
        $typeName: 'centy.v1.LinkTypeInfo',
        name: 'duplicates',
        description: 'Duplicates another issue',
        isBuiltin: true,
      },
    ],
  }
}
