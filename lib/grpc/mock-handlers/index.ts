'use client'

import * as projectHandlers from './project'
import * as issueHandlers from './issue'
import * as docHandlers from './doc'
import * as userHandlers from './user'
import * as orgHandlers from './org'
import * as configHandlers from './config'
import * as linkHandlers from './link'
import * as assetHandlers from './asset'
import * as writeHandlers from './write'
import * as daemonHandlers from './daemon'
import * as orgWriteHandlers from './org-write'
import * as stubHandlers from './stub'
import * as workspaceHandlers from './workspace'
import * as entityOpsHandlers from './entity-ops'
import { type MockHandlers } from './types'

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
  ...orgWriteHandlers,
  ...stubHandlers,
  ...workspaceHandlers,
  ...entityOpsHandlers,
}
