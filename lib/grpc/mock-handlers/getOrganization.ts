'use client'

import { DEMO_ORGANIZATION } from '../demo-data'
import type { GetOrganizationRequest, Organization } from '@/gen/centy_pb'
import { OrganizationNotFoundError } from '@/lib/errors'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getOrganization(
  request: GetOrganizationRequest
): Promise<Organization> {
  if (request.slug === DEMO_ORGANIZATION.slug) {
    return DEMO_ORGANIZATION
  }
  throw new OrganizationNotFoundError(request.slug)
}
