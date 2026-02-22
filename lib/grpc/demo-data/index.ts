'use client'

import { DEMO_ISSUES_PART1 } from './issues-part1'
import { DEMO_ISSUES_PART2 } from './issues-part2'
import { DEMO_ORG_ISSUES } from './org-issues'
import { type Issue } from '@/gen/centy_pb'

// Combine issue parts into the full array (includes org issues)
export const DEMO_ISSUES: Issue[] = [
  ...DEMO_ISSUES_PART1,
  ...DEMO_ISSUES_PART2,
  ...DEMO_ORG_ISSUES,
]

// Re-export everything from sub-modules
export {
  DEMO_PROJECT_PATH,
  DEMO_ORG_SLUG,
  DEMO_ORGANIZATION,
} from './constants'
export { DEMO_PROJECT } from './project'
export { DEMO_USERS } from './users'
export { DEMO_DOCS } from './docs'
export { DEMO_CONFIG, DEMO_DAEMON_INFO } from './config'
export { DEMO_LINKS, DEMO_ASSETS } from './links-assets'
export { DEMO_ORG_ISSUES } from './org-issues'
