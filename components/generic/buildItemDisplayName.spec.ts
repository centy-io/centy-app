import { describe, it, expect } from 'vitest'
import { buildItemDisplayName } from './buildItemDisplayName'

describe('buildItemDisplayName', () => {
  it('returns capitalized itemType when config is null', () => {
    expect(buildItemDisplayName(null, 'issue')).toBe('Issue')
  })

  it('returns capitalized config name when config is provided', () => {
    const config = {
      $typeName: 'centy.v1.ItemTypeConfigProto' as const,
      name: 'bug',
      plural: 'bugs',
      identifier: 'issues',
      statuses: [],
      defaultStatus: '',
      priorityLevels: 0,
      customFields: [],
      icon: '',
      template: '',
    }
    expect(buildItemDisplayName(config, 'issues')).toBe('Bug')
  })
})
