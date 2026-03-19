/* eslint-disable max-lines */
import type { Config, ProjectInfo, Manifest } from '@/gen/centy_pb'

// Fixed date for deterministic visual tests
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock config with default values that can be overridden.
 */
export function createMockConfig(overrides?: Partial<Config>): Config {
  const resolvedOverrides = overrides !== undefined ? overrides : {}
  return {
    customFields:
      resolvedOverrides.customFields !== undefined
        ? resolvedOverrides.customFields
        : [],
    defaults:
      resolvedOverrides.defaults !== undefined
        ? resolvedOverrides.defaults
        : {},
    priorityLevels:
      resolvedOverrides.priorityLevels !== undefined
        ? resolvedOverrides.priorityLevels
        : 3,
    version:
      resolvedOverrides.version !== undefined
        ? resolvedOverrides.version
        : '1.0.0',
    stateColors:
      resolvedOverrides.stateColors !== undefined
        ? resolvedOverrides.stateColors
        : {
            open: '#22c55e',
            'in-progress': '#3b82f6',
            'for-validation': '#f59e0b',
            closed: '#6b7280',
          },
    priorityColors:
      resolvedOverrides.priorityColors !== undefined
        ? resolvedOverrides.priorityColors
        : {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#22c55e',
          },
    workspace:
      resolvedOverrides.workspace !== undefined
        ? resolvedOverrides.workspace
        : {
            $typeName: 'centy.v1.WorkspaceConfig',
          },
    customLinkTypes:
      resolvedOverrides.customLinkTypes !== undefined
        ? resolvedOverrides.customLinkTypes
        : [],
    defaultEditor:
      resolvedOverrides.defaultEditor !== undefined
        ? resolvedOverrides.defaultEditor
        : '',
    hooks: resolvedOverrides.hooks !== undefined ? resolvedOverrides.hooks : [],
    $typeName: 'centy.v1.Config',
  }
}

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

/**
 * Creates a mock manifest object.
 */
export function createMockManifest(overrides?: Partial<Manifest>): Manifest {
  const resolvedOverrides = overrides !== undefined ? overrides : {}
  const now = FIXED_DATE

  return {
    schemaVersion:
      resolvedOverrides.schemaVersion !== undefined
        ? resolvedOverrides.schemaVersion
        : 1,
    centyVersion:
      resolvedOverrides.centyVersion !== undefined
        ? resolvedOverrides.centyVersion
        : '1.0.0',
    createdAt:
      resolvedOverrides.createdAt !== undefined
        ? resolvedOverrides.createdAt
        : now,
    updatedAt:
      resolvedOverrides.updatedAt !== undefined
        ? resolvedOverrides.updatedAt
        : now,
    $typeName: 'centy.v1.Manifest',
  }
}
