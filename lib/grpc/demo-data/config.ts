'use client'

import { type Config, type DaemonInfo } from '@/gen/centy_pb'

// Demo config
export const DEMO_CONFIG: Config = {
  $typeName: 'centy.v1.Config',
  customFields: [
    {
      $typeName: 'centy.v1.CustomFieldDefinition',
      name: 'component',
      fieldType: 'enum',
      required: false,
      defaultValue: '',
      enumValues: ['ui', 'auth', 'docs', 'performance', 'integrations'],
    },
    {
      $typeName: 'centy.v1.CustomFieldDefinition',
      name: 'effort',
      fieldType: 'enum',
      required: false,
      defaultValue: 'medium',
      enumValues: ['small', 'medium', 'large'],
    },
  ],
  defaults: {
    status: 'open',
    priority: '2',
  },
  priorityLevels: 3,
  allowedStates: ['open', 'in-progress', 'for-validation', 'closed'],
  defaultState: 'open',
  version: '0.1.5',
  stateColors: {
    open: '#22c55e',
    'in-progress': '#3b82f6',
    'for-validation': '#f59e0b',
    closed: '#6b7280',
  },
  priorityColors: {
    '1': '#ef4444',
    '2': '#f59e0b',
    '3': '#6b7280',
  },
  customLinkTypes: [],
  defaultEditor: '',
  hooks: [],
}

// Demo daemon info
export const DEMO_DAEMON_INFO: DaemonInfo = {
  $typeName: 'centy.v1.DaemonInfo',
  version: '0.1.5 (Demo)',
  binaryPath: '/demo/centy-daemon',
  vscodeAvailable: true,
}
