'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/StatusConfigDialog.css'
import type { StatusConfigDialogProps } from './StatusConfigDialog.types'
import { useStatusConfig } from './useStatusConfig'
import { StatusConfigOptions } from './StatusConfigOptions'

export function StatusConfigDialog({
  projectPath,
  onClose,
  onConfigured,
}: StatusConfigDialogProps) {
  const state = useStatusConfig(projectPath, onClose, onConfigured)

  return (
    <div className="status-config-dialog-overlay">
      <div className="status-config-dialog" ref={state.modalRef}>
        <div className="status-config-dialog-header">
          <h3>Configure Status Update Behavior</h3>
          <button className="status-config-dialog-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="status-config-dialog-body">
          {state.error && (
            <DaemonErrorMessage
              error={state.error}
              className="status-config-dialog-error"
            />
          )}

          {state.loading ? (
            <div className="status-config-dialog-loading">
              Loading configuration...
            </div>
          ) : (
            <StatusConfigOptions
              selectedOption={state.selectedOption}
              onSelectOption={state.setSelectedOption}
            />
          )}
        </div>

        <div className="status-config-dialog-footer">
          <button className="status-config-dialog-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="status-config-dialog-submit"
            onClick={state.handleSave}
            disabled={
              state.loading || state.saving || state.selectedOption === null
            }
          >
            {state.saving ? 'Saving...' : 'Save & Open VS Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
