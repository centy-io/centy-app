import type {
  Config,
  CustomFieldDefinition,
  WorkspaceConfig,
} from '@/gen/centy_pb'
import { StateListEditor } from '@/components/settings/StateListEditor'
import { PriorityEditor } from '@/components/settings/PriorityEditor'
import { CustomFieldsEditor } from '@/components/settings/CustomFieldsEditor'
import { DefaultsEditor } from '@/components/settings/DefaultsEditor'
import { WorkspaceSettingsEditor } from '@/components/settings/WorkspaceSettingsEditor'

interface SettingsConfigSectionsProps {
  config: Config
  saving: boolean
  isDirty: boolean
  updateConfig: (updates: Partial<Config>) => void
  onSave: () => void
  onReset: () => void
}

export function SettingsConfigSections({
  config,
  saving,
  isDirty,
  updateConfig,
  onSave,
  onReset,
}: SettingsConfigSectionsProps) {
  return (
    <>
      <section className="settings-section">
        <h3>Issue States</h3>
        <div className="settings-card">
          <StateListEditor
            states={config.allowedStates}
            stateColors={config.stateColors}
            defaultState={config.defaultState}
            onStatesChange={states => updateConfig({ allowedStates: states })}
            onColorsChange={colors => updateConfig({ stateColors: colors })}
            onDefaultChange={defaultState => updateConfig({ defaultState })}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>Priority Levels</h3>
        <div className="settings-card">
          <PriorityEditor
            levels={config.priorityLevels}
            colors={config.priorityColors}
            onLevelsChange={priorityLevels => updateConfig({ priorityLevels })}
            onColorsChange={colors => updateConfig({ priorityColors: colors })}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>Custom Fields</h3>
        <div className="settings-card">
          <CustomFieldsEditor
            fields={config.customFields as CustomFieldDefinition[]}
            onChange={customFields => updateConfig({ customFields })}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>Default Values</h3>
        <div className="settings-card">
          <DefaultsEditor
            value={config.defaults}
            onChange={defaults => updateConfig({ defaults })}
            suggestedKeys={config.customFields.map(f => f.name)}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3>Workspace Settings</h3>
        <div className="settings-card">
          <WorkspaceSettingsEditor
            value={config.workspace as WorkspaceConfig | undefined}
            onChange={workspace => updateConfig({ workspace })}
          />
        </div>
      </section>

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
