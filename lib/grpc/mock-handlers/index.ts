'use client'

import { projectHandlers } from './project-handlers'
import { issueHandlers } from './issue-handlers'
import { docHandlers } from './doc-handlers'
import { userHandlers } from './user-handlers'
import { orgHandlers } from './org-handlers'
import { configHandlers } from './config-handlers'
import { linkHandlers } from './link-handlers'
import { assetHandlers } from './asset-handlers'
import { writeHandlers } from './write-handlers'
import { daemonHandlers } from './daemon-handlers'
import { stubHandlers } from './stub-handlers'
import { workspaceHandlers } from './workspace-handlers'
import type { MockHandlers } from './types'

export type { MockHandlers } from './types'

// Mock handlers for all RPC methods
export const mockHandlers: MockHandlers = {
  ...projectHandlers,
  ...issueHandlers,
  ...docHandlers,
  ...userHandlers,
  ...orgHandlers,
  ...configHandlers,
  ...linkHandlers,
  ...assetHandlers,
  ...writeHandlers,
  ...daemonHandlers,
  ...stubHandlers,
  ...workspaceHandlers,
}
