'use client'

import { DEMO_ORGANIZATION } from '../demo-data'
import type {
  ListOrganizationsRequest,
  ListOrganizationsResponse,
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
