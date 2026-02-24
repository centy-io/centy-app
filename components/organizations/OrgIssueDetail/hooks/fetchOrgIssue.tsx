'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, GetItemRequestSchema } from '@/gen/centy_pb'

export async function fetchOrgIssue(orgSlug: string, issueId: string) {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  if (orgProjects.length === 0)
    return { error: 'No initialized projects in this organization' }
  const projectPath = orgProjects[0].path
  const res = await centyClient.getItem(
    create(GetItemRequestSchema, {
      projectPath,
      itemType: 'issues',
      itemId: issueId,
    })
  )
  return { projectPath, item: res.item, error: res.error }
}
