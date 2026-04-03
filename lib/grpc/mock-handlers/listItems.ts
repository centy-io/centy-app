'use client'

import { DEMO_PROJECT_PATH, DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import { issueToGenericItem } from './issueToGenericItem'
import { docToGenericItem } from './docToGenericItem'
import type {
  ListItemsRequest,
  ListItemsResponse,
  GenericItem,
} from '@/gen/centy_pb'

const EMPTY_ITEMS: GenericItem[] = []

// eslint-disable-next-line @typescript-eslint/require-await
export async function listItems(
  request: ListItemsRequest
): Promise<ListItemsResponse> {
  if (request.projectPath !== DEMO_PROJECT_PATH) {
    return {
      $typeName: 'centy.v1.ListItemsResponse',
      items: EMPTY_ITEMS,
      success: true,
      error: '',
      totalCount: 0,
    }
  }

  if (request.itemType === 'issues') {
    const items = DEMO_ISSUES.map(issueToGenericItem)
    return {
      $typeName: 'centy.v1.ListItemsResponse',
      items,
      success: true,
      error: '',
      totalCount: items.length,
    }
  }

  if (request.itemType === 'docs') {
    const items = DEMO_DOCS.map(docToGenericItem)
    return {
      $typeName: 'centy.v1.ListItemsResponse',
      items,
      success: true,
      error: '',
      totalCount: items.length,
    }
  }

  return {
    $typeName: 'centy.v1.ListItemsResponse',
    items: EMPTY_ITEMS,
    success: true,
    error: '',
    totalCount: 0,
  }
}
