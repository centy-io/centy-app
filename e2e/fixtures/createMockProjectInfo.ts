import type { ProjectInfo } from '@/gen/centy_pb'

const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock project info object.
 */
export function createMockProjectInfo(
  overrides?: Partial<ProjectInfo>
): ProjectInfo {
  const o = overrides ?? {}
  const now = FIXED_DATE

  return {
    path: o.path ?? '/test/project',
    firstAccessed: o.firstAccessed ?? now,
    lastAccessed: o.lastAccessed ?? now,
    issueCount: o.issueCount ?? 0,
    docCount: o.docCount ?? 0,
    initialized: o.initialized ?? true,
    name: o.name ?? 'Test Project',
    isFavorite: o.isFavorite ?? false,
    isArchived: o.isArchived ?? false,
    displayPath: o.displayPath ?? '/test/project',
    organizationSlug: o.organizationSlug ?? '',
    organizationName: o.organizationName ?? '',
    userTitle: o.userTitle ?? '',
    projectTitle: o.projectTitle ?? '',
    projectVersion: o.projectVersion ?? '',
    projectBehind: o.projectBehind ?? false,
    $typeName: 'centy.v1.ProjectInfo',
  }
}
