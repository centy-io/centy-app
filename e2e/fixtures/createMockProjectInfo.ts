import type { ProjectInfo } from '@/gen/centy_pb'

const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock project info object.
 */
export function createMockProjectInfo(
  overrides?: Partial<ProjectInfo>
): ProjectInfo {
  const o = overrides !== undefined ? overrides : {}
  const now = FIXED_DATE

  return {
    path: o.path !== undefined ? o.path : '/test/project',
    firstAccessed: o.firstAccessed !== undefined ? o.firstAccessed : now,
    lastAccessed: o.lastAccessed !== undefined ? o.lastAccessed : now,
    issueCount: o.issueCount !== undefined ? o.issueCount : 0,
    docCount: o.docCount !== undefined ? o.docCount : 0,
    initialized: o.initialized !== undefined ? o.initialized : true,
    name: o.name !== undefined ? o.name : 'Test Project',
    isFavorite: o.isFavorite !== undefined ? o.isFavorite : false,
    isArchived: o.isArchived !== undefined ? o.isArchived : false,
    displayPath: o.displayPath !== undefined ? o.displayPath : '/test/project',
    organizationSlug:
      o.organizationSlug !== undefined ? o.organizationSlug : '',
    organizationName:
      o.organizationName !== undefined ? o.organizationName : '',
    userTitle: o.userTitle !== undefined ? o.userTitle : '',
    projectTitle: o.projectTitle !== undefined ? o.projectTitle : '',
    projectVersion: o.projectVersion !== undefined ? o.projectVersion : '',
    projectBehind: o.projectBehind !== undefined ? o.projectBehind : false,
    $typeName: 'centy.v1.ProjectInfo',
  }
}
