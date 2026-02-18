'use client'

import { DEMO_ORGANIZATION } from '../demo-data'
import type {
  ListOrganizationsRequest,
  ListOrganizationsResponse,
  GetOrganizationRequest,
  Organization,
} from '@/gen/centy_pb'

export async function listOrganizations(
  _request: ListOrganizationsRequest
): Promise<ListOrganizationsResponse> {
  return {
    $typeName: 'centy.v1.ListOrganizationsResponse',
    organizations: [DEMO_ORGANIZATION],
    totalCount: 1,
    success: true,
    error: '',
  }
}

export async function getOrganization(
  request: GetOrganizationRequest
): Promise<Organization> {
  if (request.slug === DEMO_ORGANIZATION.slug) {
    return DEMO_ORGANIZATION
  }
  throw new Error(`Organization ${request.slug} not found`)
}
