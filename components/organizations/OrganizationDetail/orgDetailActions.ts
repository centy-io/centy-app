import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
  UpdateOrganizationRequestSchema,
  DeleteOrganizationRequestSchema,
  ListProjectsRequestSchema,
  type Organization,
  type ProjectInfo,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export interface FetchOrgResult {
  organization: Organization
  projects: ProjectInfo[]
}

export async function fetchOrganizationData(
  orgSlug: string
): Promise<FetchOrgResult> {
  const request = create(GetOrganizationRequestSchema, { slug: orgSlug })
  const response = await centyClient.getOrganization(request)
  if (!response.found || !response.organization) {
    throw new Error('Organization not found')
  }
  const org = response.organization
  const projectsRequest = create(ListProjectsRequestSchema, {
    organizationSlug: orgSlug,
  })
  const projectsResponse = await centyClient.listProjects(projectsRequest)
  return { organization: org, projects: projectsResponse.projects }
}

export function handleFetchError(err: unknown): string {
  const message =
    err instanceof Error ? err.message : 'Failed to connect to daemon'
  if (isDaemonUnimplemented(message)) {
    return 'Organizations feature is not available. Please update your daemon.'
  }
  return message
}

export interface SaveOrgParams {
  orgSlug: string
  editName: string
  editDescription: string
  editSlug: string
}

export async function saveOrganization(params: SaveOrgParams) {
  const request = create(UpdateOrganizationRequestSchema, {
    slug: params.orgSlug,
    name: params.editName,
    description: params.editDescription,
    newSlug: params.editSlug !== params.orgSlug ? params.editSlug : undefined,
  })
  return centyClient.updateOrganization(request)
}

export async function deleteOrganization(orgSlug: string) {
  const request = create(DeleteOrganizationRequestSchema, { slug: orgSlug })
  return centyClient.deleteOrganization(request)
}
