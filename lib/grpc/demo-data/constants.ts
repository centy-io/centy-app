'use client'

import { type Organization } from '@/gen/centy_pb'

// Demo project path - virtual path for demo mode
export const DEMO_PROJECT_PATH = '/demo/centy-showcase'

// Demo organization slug
export const DEMO_ORG_SLUG = 'demo-org'

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
