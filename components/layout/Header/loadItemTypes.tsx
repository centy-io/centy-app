'use client'

import { create } from '@bufbuild/protobuf'
import type { NavItemType } from './types'
import { ListItemTypesRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'
import { resolveProject } from '@/lib/project-resolver'

export async function loadItemTypes(
  effectiveOrg: string,
  effectiveProject: string
): Promise<NavItemType[]> {
  const resolution = await resolveProject(effectiveOrg, effectiveProject)
  if (!resolution) return []
  const req = create(ListItemTypesRequestSchema, {
    projectPath: resolution.projectPath,
  })
  const res = await centyClient.listItemTypes(req)
  return res.itemTypes
    .map(t => ({ name: t.name, plural: t.plural, itemCount: t.itemCount }))
    .sort((a, b) => b.itemCount - a.itemCount)
}
