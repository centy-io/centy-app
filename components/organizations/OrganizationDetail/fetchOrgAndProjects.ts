import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
  ListProjectsRequestSchema,
  type Organization,
  type ProjectInfo,
} from '@/gen/centy_pb'

export async function fetchOrgAndProjects(
  orgSlug: string
): Promise<{ org: Organization; projects: ProjectInfo[] } | string> {
  const res = await centyClient.getOrganization(
    create(GetOrganizationRequestSchema, { slug: orgSlug })
  )
  if (!res.found || !res.organization) return 'Organization not found'
  const org = res.organization
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  return { org, projects: projectsRes.projects }
}
