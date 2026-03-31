import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListItemTypesRequestSchema,
} from '@/gen/centy_pb'

export async function fetchOrgProjectPathAndStatuses(
  orgSlug: string
): Promise<{ projectPath: string; statuses: string[] } | string> {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  if (orgProjects.length === 0)
    return 'No initialized projects in this organization'
  const projectPath = orgProjects[0].path
  let statuses: string[] = []
  try {
    const itemTypesRes = await centyClient.listItemTypes(
      create(ListItemTypesRequestSchema, { projectPath })
    )
    const issueType = itemTypesRes.itemTypes.find(t => t.plural === 'issues')
    if (issueType) statuses = issueType.statuses
  } catch {
    // fall back to defaults
  }
  return { projectPath, statuses }
}
