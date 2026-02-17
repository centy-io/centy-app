'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  UpdateConfigRequestSchema,
  type Config,
} from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import '@/styles/components/StatusConfigDialog.css'

interface StatusConfigDialogProps {
  projectPath: string
  onClose: () => void
  onConfigured: () => void
}

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, onClose])
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])
}

function useLoadConfig(projectPath: string) {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null)

  useEffect(() => {
    async function loadConfig() {
      try {
        const request = create(GetConfigRequestSchema, {
          projectPath,
        })
        const response = await centyClient.getConfig(request)
        if (response.config) {
          setConfig(response.config)
          if (response.config.workspace) {
            setSelectedOption(
              response.config.workspace.updateStatusOnOpen ?? false
            )
          }
        } else {
          setLoadError(response.error || 'Failed to load project configuration')
        }
      } catch (err) {
        console.error('Failed to load config:', err)
        setLoadError('Failed to load project configuration')
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [projectPath])

  return { config, loading, loadError, selectedOption, setSelectedOption }
}

function useSaveConfig(
  config: Config | null,
  projectPath: string,
  selectedOption: boolean | null,
  onConfigured: () => void
) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    if (selectedOption === null || !config) return

    setSaving(true)
    setError(null)

    try {
      const updatedConfig = {
        ...config,
        workspace: {
          updateStatusOnOpen: selectedOption,
          $typeName: 'centy.v1.WorkspaceConfig' as const,
        },
      }

      const request = create(UpdateConfigRequestSchema, {
        projectPath,
        config: updatedConfig,
      })
      const response = await centyClient.updateConfig(request)

      if (response.success) {
        onConfigured()
      } else {
        setError(response.error || 'Failed to save configuration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [config, projectPath, selectedOption, onConfigured])

  return { saving, saveError: error, handleSave }
}

function StatusOptions({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: boolean | null
  setSelectedOption: (value: boolean) => void
}) {
  return (
    <div className="status-config-dialog-options">
      <label
        className={`status-config-option ${selectedOption === true ? 'selected' : ''}`}
      >
        <input
          type="radio"
          name="updateStatus"
          checked={selectedOption === true}
          onChange={() => setSelectedOption(true)}
        />
        <div className="status-config-option-content">
          <span className="status-config-option-title">
            Yes, update status automatically
          </span>
          <span className="status-config-option-description">
            Issue status will change to &quot;in-progress&quot; when an agent
            starts working
          </span>
        </div>
      </label>

      <label
        className={`status-config-option ${selectedOption === false ? 'selected' : ''}`}
      >
        <input
          type="radio"
          name="updateStatus"
          checked={selectedOption === false}
          onChange={() => setSelectedOption(false)}
        />
        <div className="status-config-option-content">
          <span className="status-config-option-title">
            No, keep status unchanged
          </span>
          <span className="status-config-option-description">
            Issue status will remain as-is when an agent starts working
          </span>
        </div>
      </label>
    </div>
  )
}

function StatusConfigDialogBody({
  displayError,
  loading,
  selectedOption,
  setSelectedOption,
}: {
  displayError: string | null
  loading: boolean
  selectedOption: boolean | null
  setSelectedOption: (value: boolean) => void
}) {
  return (
    <div className="status-config-dialog-body">
      {displayError && (
        <DaemonErrorMessage
          error={displayError}
          className="status-config-dialog-error"
        />
      )}

      {loading ? (
        <div className="status-config-dialog-loading">
          Loading configuration...
        </div>
      ) : (
        <>
          <p className="status-config-dialog-description">
            When an AI agent starts working on an issue, should the issue status
            be automatically updated to &quot;in-progress&quot;?
          </p>

          <StatusOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </>
      )}
    </div>
  )
}

export function StatusConfigDialog({
  projectPath,
  onClose,
  onConfigured,
}: StatusConfigDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const { config, loading, loadError, selectedOption, setSelectedOption } =
    useLoadConfig(projectPath)

  const { saving, saveError, handleSave } = useSaveConfig(
    config,
    projectPath,
    selectedOption,
    onConfigured
  )

  useClickOutside(modalRef, onClose)
  useEscapeKey(onClose)

  const displayError = saveError || loadError

  return (
    <div className="status-config-dialog-overlay">
      <div className="status-config-dialog" ref={modalRef}>
        <div className="status-config-dialog-header">
          <h3>Configure Status Update Behavior</h3>
          <button className="status-config-dialog-close" onClick={onClose}>
            x
          </button>
        </div>

        <StatusConfigDialogBody
          displayError={displayError}
          loading={loading}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

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
