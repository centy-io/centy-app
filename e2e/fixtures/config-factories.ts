import type { Config } from '@/gen/centy_pb'

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
