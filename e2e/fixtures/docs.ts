import type { Doc, DocMetadata } from '@/gen/centy_pb'

// Fixed date for deterministic visual tests
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock doc with default values that can be overridden.
 */
export function createMockDoc(overrides?: Partial<Doc>): Doc {
  const resolvedOverrides = overrides !== undefined ? overrides : {}
  const slug =
    resolvedOverrides.slug !== undefined ? resolvedOverrides.slug : 'test-doc'
  const now = FIXED_DATE

  const defaultMetadata: DocMetadata = {
    createdAt: now,
    updatedAt: now,
    deletedAt: '',
    isOrgDoc: false,
    orgSlug: '',
    $typeName: 'centy.v1.DocMetadata',
  }

  return {
    slug,
    title:
      resolvedOverrides.title !== undefined
        ? resolvedOverrides.title
        : `Test Document`,
    content:
      resolvedOverrides.content !== undefined
        ? resolvedOverrides.content
        : `# Test Document\n\nThis is test content.`,
    metadata: {
      ...defaultMetadata,
      ...resolvedOverrides.metadata,
    },
    $typeName: 'centy.v1.Doc',
  }
}

/**
 * Creates a mock doc metadata object.
 */
export function createMockDocMetadata(
  overrides?: Partial<DocMetadata>
): DocMetadata {
  const resolvedOverrides = overrides !== undefined ? overrides : {}
  const now = FIXED_DATE

  return {
    createdAt:
      resolvedOverrides.createdAt !== undefined
        ? resolvedOverrides.createdAt
        : now,
    updatedAt:
      resolvedOverrides.updatedAt !== undefined
        ? resolvedOverrides.updatedAt
        : now,
    deletedAt:
      resolvedOverrides.deletedAt !== undefined
        ? resolvedOverrides.deletedAt
        : '',
    isOrgDoc:
      resolvedOverrides.isOrgDoc !== undefined
        ? resolvedOverrides.isOrgDoc
        : false,
    orgSlug:
      resolvedOverrides.orgSlug !== undefined ? resolvedOverrides.orgSlug : '',
    $typeName: 'centy.v1.DocMetadata',
  }
}

/**
 * Factory functions for common test scenarios.
 */
export const createDocScenario = {
  /** Returns an empty array of docs */
  empty: (): Doc[] => [],

  /** Returns a single doc */
  single: (overrides?: Partial<Doc>): Doc[] => [
    createMockDoc(overrides !== undefined ? overrides : {}),
  ],

  /** Returns multiple docs */
  many: (count: number): Doc[] =>
    Array.from({ length: count }, (_, i) =>
      createMockDoc({
        slug: `doc-${i + 1}`,
        title: `Document ${i + 1}`,
        content: `# Document ${i + 1}\n\nContent for document ${i + 1}.`,
      })
    ),

  /** Returns docs with different content types */
  withContent: (): Doc[] => [
    createMockDoc({
      slug: 'getting-started',
      title: 'Getting Started',
      content: `# Getting Started\n\nWelcome to the project!\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\``,
    }),
    createMockDoc({
      slug: 'api-reference',
      title: 'API Reference',
      content: `# API Reference\n\n## Endpoints\n\n- GET /api/issues\n- POST /api/issues`,
    }),
    createMockDoc({
      slug: 'contributing',
      title: 'Contributing',
      content: `# Contributing\n\nThank you for your interest in contributing!`,
    }),
  ],

  /** Returns a README-style doc */
  readme: (): Doc =>
    createMockDoc({
      slug: 'readme',
      title: 'README',
      content: `# Project Name\n\nA brief description of the project.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3`,
    }),
}

/**
 * Default mock docs for general use.
 */
export const mockDocs: Doc[] = createDocScenario.many(3)
