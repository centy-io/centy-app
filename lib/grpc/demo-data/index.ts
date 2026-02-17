'use client'

import { DEMO_ISSUES_PART1 } from './issues'
import { DEMO_ISSUES_PART2 } from './issues-continued'
import { DEMO_ISSUES_PART3 } from './issues-final'
import { DEMO_DOCS_PART1 } from './docs'
import { DEMO_DOCS_PART2 } from './docs-continued'

export {
  DEMO_PROJECT_PATH,
  DEMO_ORG_SLUG,
  DEMO_ORGANIZATION,
} from './constants'
export { DEMO_PROJECT } from './project'
export { DEMO_USERS } from './users'
export { DEMO_CONFIG, DEMO_DAEMON_INFO } from './config'
export { DEMO_LINKS, DEMO_ASSETS } from './links-and-assets'

// Combined arrays for backward compatibility
export const DEMO_ISSUES = [
  ...DEMO_ISSUES_PART1,
  ...DEMO_ISSUES_PART2,
  ...DEMO_ISSUES_PART3,
]
export const DEMO_DOCS = [...DEMO_DOCS_PART1, ...DEMO_DOCS_PART2]
