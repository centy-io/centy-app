// Re-export everything from the new generated files (after proto submodule migration).
// This barrel maintains backward-compatible imports for `@/gen/centy_pb`.
export * from './centy/v1/centy_pb'
export * from './centy/v1/generic_item_pb'

// ---------------------------------------------------------------------------
// Legacy types — Issue, Doc and related shapes.
// These were removed from the canonical proto (centy-io/proto) as the API
// migrated to the generic-item model. They are kept here as plain TypeScript
// interfaces so that demo/test fixtures continue to compile. No protobuf
// serialisation is needed for these types.
// ---------------------------------------------------------------------------

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
