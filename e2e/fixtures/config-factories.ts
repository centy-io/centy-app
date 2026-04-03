import type { Config, ProjectInfo, Manifest } from '@/gen/centy_pb'

// Fixed date for deterministic visual tests
const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock config with default values that can be overridden.
 */
export function createMockConfig(overrides?: Partial<Config>): Config {
  const resolvedOverrides = overrides ?? {}
  return {
    customFields: resolvedOverrides.customFields ?? [],
    defaults: resolvedOverrides.defaults ?? {},
    priorityLevels: resolvedOverrides.priorityLevels ?? 3,
    version: resolvedOverrides.version ?? '1.0.0',
    stateColors: resolvedOverrides.stateColors ?? {
      open: '#22c55e',
      'in-progress': '#3b82f6',
      'for-validation': '#f59e0b',
      closed: '#6b7280',
    },
    priorityColors: resolvedOverrides.priorityColors ?? {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e',
    },
    workspace: resolvedOverrides.workspace ?? {
      $typeName: 'centy.v1.WorkspaceConfig',
    },
    customLinkTypes: resolvedOverrides.customLinkTypes ?? [],
    defaultEditor: resolvedOverrides.defaultEditor ?? '',
    hooks: resolvedOverrides.hooks ?? [],
    userValues: resolvedOverrides.userValues ?? {},
    $typeName: 'centy.v1.Config',
  }
}

/**
 * Creates a mock project info object.
 */
export function createMockProjectInfo(
  overrides?: Partial<ProjectInfo>
): ProjectInfo {
  const resolvedOverrides = overrides ?? {}

  return {
    path: resolvedOverrides.path ?? '/test/project',
    firstAccessed: resolvedOverrides.firstAccessed ?? FIXED_DATE,
    lastAccessed: resolvedOverrides.lastAccessed ?? FIXED_DATE,
    issueCount: resolvedOverrides.issueCount ?? 0,
    docCount: resolvedOverrides.docCount ?? 0,
    initialized: resolvedOverrides.initialized ?? true,
    name: resolvedOverrides.name ?? 'Test Project',
    isFavorite: resolvedOverrides.isFavorite ?? false,
    isArchived: resolvedOverrides.isArchived ?? false,
    displayPath: resolvedOverrides.displayPath ?? '/test/project',
    organizationSlug: resolvedOverrides.organizationSlug ?? '',
    organizationName: resolvedOverrides.organizationName ?? '',
    userTitle: resolvedOverrides.userTitle ?? '',
    projectTitle: resolvedOverrides.projectTitle ?? '',
    projectVersion: resolvedOverrides.projectVersion ?? '',
    projectBehind: resolvedOverrides.projectBehind ?? false,
    $typeName: 'centy.v1.ProjectInfo',
  }
}

/**
 * Creates a mock manifest object.
 */
export function createMockManifest(overrides?: Partial<Manifest>): Manifest {
  const resolvedOverrides = overrides ?? {}
  const now = FIXED_DATE

  return {
    schemaVersion: resolvedOverrides.schemaVersion ?? 1,
    centyVersion: resolvedOverrides.centyVersion ?? '1.0.0',
    createdAt: resolvedOverrides.createdAt ?? now,
    $typeName: 'centy.v1.Manifest',
  }
}
