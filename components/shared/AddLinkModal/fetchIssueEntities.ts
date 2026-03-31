import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { filterAndMapIssues } from './filterAndMapIssues'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type Link as LinkType } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

export async function fetchIssueEntities(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  query: string
): Promise<EntityItem[]> {
  const request = create(ListItemsRequestSchema, {
    projectPath,
    itemType: 'issues',
  })
  const response = await centyClient.listItems(request)
  return filterAndMapIssues(
    response.items.map(genericItemToIssue),
    entityId,
    existingLinks,
    selectedLinkType,
    query
  )
}
