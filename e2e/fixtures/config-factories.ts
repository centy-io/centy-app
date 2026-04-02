import type { Config } from '@/gen/centy_pb'

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
    userValues:
      resolvedOverrides.userValues !== undefined
        ? resolvedOverrides.userValues
        : {},
    $typeName: 'centy.v1.Config',
  }
}
