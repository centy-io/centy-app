// Re-export everything from the new generated files (after proto submodule migration).
// This barrel maintains backward-compatible imports for `@/gen/centy_pb`.
export * from './centy/v1/centy_pb'
export * from './centy/v1/generic_item_pb'

// ---------------------------------------------------------------------------
// Legacy types — Issue, Doc and related request/response shapes.
// These were removed from the canonical proto (centy-io/proto) as the API
// migrated to the generic-item model. They are kept here as plain TypeScript
// interfaces so that demo/test fixtures continue to compile. No protobuf
// serialisation is needed for these types.
// ---------------------------------------------------------------------------

import type { Manifest } from './centy/v1/generic_item_pb'

export interface IssueMetadata {
  $typeName: 'centy.v1.IssueMetadata'
  displayNumber: number
  status: string
  priority: number
  createdAt: string
  updatedAt: string
  customFields: { [key: string]: string }
  priorityLabel: string
  draft: boolean
  deletedAt: string
  isOrgIssue: boolean
  orgSlug: string
  orgDisplayNumber: number
}

export interface Issue {
  $typeName: 'centy.v1.Issue'
  id: string
  displayNumber: number
  issueNumber: string
  title: string
  description: string
  metadata?: IssueMetadata
}

export interface DocMetadata {
  $typeName: 'centy.v1.DocMetadata'
  createdAt: string
  updatedAt: string
  deletedAt: string
  isOrgDoc: boolean
  orgSlug: string
}

export interface Doc {
  $typeName: 'centy.v1.Doc'
  slug: string
  title: string
  content: string
  metadata?: DocMetadata
}

// --- Issue request/response types (used in legacy mock handlers / fixtures) ---

export interface OrgDocSyncResult {
  $typeName: 'centy.v1.OrgDocSyncResult'
  projectPath: string
  success: boolean
  error: string
}

export interface CreateIssueResponse {
  $typeName: 'centy.v1.CreateIssueResponse'
  success: boolean
  error: string
  id: string
  displayNumber: number
  issueNumber: string
  createdFiles: string[]
  manifest?: Manifest
  orgDisplayNumber: number
  syncResults: OrgDocSyncResult[]
}

export interface ListIssuesRequest {
  $typeName: 'centy.v1.ListIssuesRequest'
  projectPath: string
  status: string
  priority: number
  draft?: boolean
  includeDeleted: boolean
}

export interface ListIssuesResponse {
  $typeName: 'centy.v1.ListIssuesResponse'
  issues: Issue[]
  totalCount: number
  success: boolean
  error: string
}

export interface GetIssueRequest {
  $typeName: 'centy.v1.GetIssueRequest'
  projectPath: string
  issueId: string
}

export interface GetIssueByDisplayNumberRequest {
  $typeName: 'centy.v1.GetIssueByDisplayNumberRequest'
  projectPath: string
  displayNumber: number
}

// --- Doc request/response types ---

export interface CreateDocResponse {
  $typeName: 'centy.v1.CreateDocResponse'
  success: boolean
  error: string
  slug: string
  createdFile: string
  manifest?: Manifest
  syncResults: OrgDocSyncResult[]
}

