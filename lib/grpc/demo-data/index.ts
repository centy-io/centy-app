'use client'

import { type Issue } from '@/gen/centy_pb'
import { DEMO_ISSUES_PART1 } from './issues-part1'
import { DEMO_ISSUES_PART2 } from './issues-part2'

// Combine issue parts into the full array
export const DEMO_ISSUES: Issue[] = [...DEMO_ISSUES_PART1, ...DEMO_ISSUES_PART2]

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
