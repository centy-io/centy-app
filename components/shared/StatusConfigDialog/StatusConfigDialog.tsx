'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/StatusConfigDialog.css'
import type { StatusConfigDialogProps } from './StatusConfigDialog.types'
import { useStatusConfig } from './useStatusConfig'
import { StatusOptions } from './StatusOptions'

export function StatusConfigDialog({
  projectPath,
  onClose,
  onConfigured,
}: StatusConfigDialogProps) {
  const {
    modalRef,
    loading,
    saving,
    error,
    selectedOption,
    setSelectedOption,
    handleSave,
  } = useStatusConfig(projectPath, onClose, onConfigured)

  return (
    <div className="status-config-dialog-overlay">
      <div className="status-config-dialog" ref={modalRef}>
        <div className="status-config-dialog-header">
          <h3>Configure Status Update Behavior</h3>
          <button className="status-config-dialog-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="status-config-dialog-body">
          {error && (
            <DaemonErrorMessage
              error={error}
              className="status-config-dialog-error"
            />
          )}

          {loading ? (
            <div className="status-config-dialog-loading">
              Loading configuration...
            </div>
          ) : (
            <StatusOptions
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          )}
        </div>

        <div className="status-config-dialog-footer">
          <button className="status-config-dialog-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="status-config-dialog-submit"
            onClick={handleSave}
            disabled={loading || saving || selectedOption === null}
          >
            {saving ? 'Saving...' : 'Save & Open VS Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
