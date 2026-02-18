'use client'

import { type ProjectInfo } from '@/gen/centy_pb'
import { DEMO_PROJECT_PATH } from './constants'

// Demo project
export const DEMO_PROJECT: ProjectInfo = {
  $typeName: 'centy.v1.ProjectInfo',
  path: DEMO_PROJECT_PATH,
  firstAccessed: '2024-01-15T10:00:00Z',
  lastAccessed: new Date().toISOString(),
  issueCount: 7,
  docCount: 3,
  initialized: true,
  name: 'centy-showcase',
  displayPath: '~/demo/centy-showcase',
  isFavorite: true,
  isArchived: false,
  organizationSlug: 'demo-org',
  organizationName: 'Demo Organization',
  userTitle: '',
  projectTitle: 'Centy Showcase Project',
}
