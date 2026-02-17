'use client'

import { type WorkspaceConfig } from '@/gen/centy_pb'

interface WorkspaceSettingsEditorProps {
  value: WorkspaceConfig | undefined
  onChange: (config: WorkspaceConfig) => void
}

export function WorkspaceSettingsEditor({
  value,
  onChange,
}: WorkspaceSettingsEditorProps) {
  const config: WorkspaceConfig = value || {
    $typeName: 'centy.v1.WorkspaceConfig',
  }

  return (
    <div className="workspace-settings-editor">
      <label className="workspace-settings-checkbox">
        <input
          type="checkbox"
          checked={config.updateStatusOnOpen || false}
          onChange={e =>
            onChange({
              ...config,
              updateStatusOnOpen: e.target.checked,
            })
          }
          className="workspace-settings-checkbox-input"
        />
        <span className="workspace-settings-checkbox-label">
          <strong className="workspace-settings-checkbox-title">
            Update status on open
          </strong>
          <span className="workspace-settings-checkbox-description">
            Update status to in-progress when a workspace is opened
          </span>
        </span>
      </label>
    </div>
  )
}
