'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetOrganizationRequestSchema,
  ListProjectsRequestSchema,
} from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

export function formatOrgErr(err: unknown): string {
  const m = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(m)
    ? 'Organizations feature is not available. Please update your daemon.'
    : m
}

export async function fetchOrgAndProjects(orgSlug: string) {
  const res = await centyClient.getOrganization(
    create(GetOrganizationRequestSchema, { slug: orgSlug })
  )
  if (!res.found || !res.organization)
    return { error: 'Organization not found' }
  const listRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  return { organization: res.organization, projects: listRes.projects }
}
