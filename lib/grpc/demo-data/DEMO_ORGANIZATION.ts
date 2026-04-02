'use client'

import { type Organization } from '@/gen/centy_pb'

// Demo organization
export const DEMO_ORGANIZATION: Organization = {
  $typeName: 'centy.v1.Organization',
  slug: 'demo-org',
  name: 'Demo Organization',
  description: 'A sample organization for demonstration purposes',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-12-01T14:30:00Z',
  projectCount: 1,
}
