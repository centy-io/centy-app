'use client'

import { type WorkspaceConfig } from '@/gen/centy_pb'

interface LlmSettingsEditorProps {
  value: WorkspaceConfig | undefined
  onChange: (config: WorkspaceConfig) => void
}

export function LlmSettingsEditor({ value, onChange }: LlmSettingsEditorProps) {
  const config: WorkspaceConfig = value || {
    $typeName: 'centy.v1.WorkspaceConfig',
  }

  return (
    <div className="llm-settings-editor">
      <label className="llm-checkbox">
        <input
          type="checkbox"
          checked={config.updateStatusOnOpen || false}
          onChange={e =>
            onChange({
              ...config,
              updateStatusOnOpen: e.target.checked,
            })
          }
        />
        <span className="llm-checkbox-label">
          <strong>Update status on open</strong>
          <span className="llm-checkbox-description">
            Update status to in-progress when a workspace is opened
          </span>
        </span>
      </label>
    </div>
  )
}
