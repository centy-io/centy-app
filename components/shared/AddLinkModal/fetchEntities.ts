import { create } from '@bufbuild/protobuf'
import type { EntityItem } from './AddLinkModal.types'
import { filterAndMap } from './filterAndMap'
import { fetchItemList } from '@/components/generic/fetchItemList'
import { centyClient } from '@/lib/grpc/client'
import {
  ListItemTypesRequestSchema,
  type Link as LinkType,
} from '@/gen/centy_pb'

export async function fetchEntities(
  projectPath: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  query: string
): Promise<EntityItem[]> {
  const typesResponse = await centyClient.listItemTypes(
    create(ListItemTypesRequestSchema, { projectPath })
  )
  const results = await Promise.all(
    typesResponse.itemTypes.map(t => fetchItemList(projectPath, t.plural))
  )
  const allItems = results.flatMap(r => r.items)
  return filterAndMap(
    allItems,
    entityId,
    existingLinks,
    selectedLinkType,
    query
  )
}
