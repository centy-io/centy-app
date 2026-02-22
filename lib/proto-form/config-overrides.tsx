'use client'

import type { FieldGroup, FieldOverride } from './types'
import { toStringArray, toStringRecord, toNumber, toCustomFields, toWorkspaceConfig } from './config-helpers'
import { StateListEditor } from '@/components/settings/StateListEditor'
import { PriorityEditor } from '@/components/settings/PriorityEditor'
import { CustomFieldsEditor } from '@/components/settings/CustomFieldsEditor'
import { DefaultsEditor } from '@/components/settings/DefaultsEditor'
import { WorkspaceSettingsEditor } from '@/components/settings/WorkspaceSettingsEditor'

export const CONFIG_FIELD_GROUPS: FieldGroup[] = [
  {
    key: 'issue-states',
    claimedFields: ['allowedStates', 'stateColors', 'defaultState'],
    title: 'Issue States',
    order: 10,
    render: ({ value, onChange }) => {
      const allowedStates = toStringArray(value.allowedStates)
      const stateColors = toStringRecord(value.stateColors)
      const defaultState = typeof value.defaultState === 'string' ? value.defaultState : ''
      return (
        <StateListEditor
          states={allowedStates}
          stateColors={stateColors}
          defaultState={defaultState}
          onStatesChange={states => onChange({ allowedStates: states })}
          onColorsChange={colors => onChange({ stateColors: colors })}
          onDefaultChange={ds => onChange({ defaultState: ds })}
        />
      )
    },
  },
  {
    key: 'priorities',
    claimedFields: ['priorityLevels', 'priorityColors'],
    title: 'Priority Levels',
    order: 20,
    render: ({ value, onChange }) => {
      const priorityLevels = toNumber(value.priorityLevels, 3)
      const priorityColors = toStringRecord(value.priorityColors)
      return (
        <PriorityEditor
          levels={priorityLevels}
          colors={priorityColors}
          onLevelsChange={levels => onChange({ priorityLevels: levels })}
          onColorsChange={colors => onChange({ priorityColors: colors })}
        />
      )
    },
  },
  {
    key: 'custom-fields',
    claimedFields: ['customFields'],
    title: 'Custom Fields',
    order: 30,
    render: ({ value, onChange }) => (
      <CustomFieldsEditor
        fields={toCustomFields(value.customFields)}
        onChange={fields => onChange({ customFields: fields })}
      />
    ),
  },
  {
    key: 'defaults',
    claimedFields: ['defaults'],
    title: 'Default Values',
    order: 40,
    render: ({ value, onChange }) => (
      <DefaultsEditor
        value={toStringRecord(value.defaults)}
        onChange={d => onChange({ defaults: d })}
        suggestedKeys={toCustomFields(value.customFields).map(f => f.name)}
      />
    ),
  },
  {
    key: 'workspace',
    claimedFields: ['workspace'],
    title: 'Workspace Settings',
    order: 50,
    render: ({ value, onChange }) => (
      <WorkspaceSettingsEditor
        value={toWorkspaceConfig(value.workspace)}
        onChange={ws => onChange({ workspace: ws })}
      />
    ),
  },
]

export const CONFIG_FIELD_OVERRIDES: Record<string, FieldOverride> = {
  version: { label: 'Project Version' },
  defaultEditor: { label: 'Default Editor' },
}
