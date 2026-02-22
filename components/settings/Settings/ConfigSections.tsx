import type { Config } from '@/gen/centy_pb'
import { ConfigSchema } from '@/gen/centy_pb'
import { ProtoFormRenderer } from '@/components/proto-form/ProtoFormRenderer'
import {
  CONFIG_FIELD_GROUPS,
  CONFIG_FIELD_OVERRIDES,
} from '@/lib/proto-form/config-overrides'

interface ConfigSectionsProps {
  config: Config
  saving: boolean
  isDirty: boolean
  updateConfig: (updates: Partial<Config>) => void
  onSave: () => void
  onReset: () => void
}

export function ConfigSections({
  config,
  saving,
  isDirty,
  updateConfig,
  onSave,
  onReset,
}: ConfigSectionsProps) {
  const formValue: Record<string, unknown> = {}
  Object.assign(formValue, config)

  const handleChange = (updates: Record<string, unknown>) => {
    const configUpdate: Partial<Config> = {}
    Object.assign(configUpdate, updates)
    updateConfig(configUpdate)
  }

  return (
    <>
      <ProtoFormRenderer
        schema={ConfigSchema}
        value={formValue}
        onChange={handleChange}
        fieldGroups={CONFIG_FIELD_GROUPS}
        fieldOverrides={CONFIG_FIELD_OVERRIDES}
      />

      <div className="settings-actions">
        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty || saving}
          className="reset-btn"
        >
          Reset Changes
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || saving}
          className="save-btn"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </>
  )
}
