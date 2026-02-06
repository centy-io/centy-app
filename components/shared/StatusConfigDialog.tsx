'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { centyClient } from '@/lib/grpc/client'
import { create } from '@bufbuild/protobuf'
import {
  GetConfigRequestSchema,
  UpdateConfigRequestSchema,
  WorkspaceMode,
  type Config,
} from '@/gen/centy_pb'
import '@/styles/components/StatusConfigDialog.css'

interface StatusConfigDialogProps {
  projectPath: string
  onClose: () => void
  onConfigured: () => void
}

export function StatusConfigDialog({
  projectPath,
  onClose,
  onConfigured,
}: StatusConfigDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null)

  // Load current config
  useEffect(() => {
    async function loadConfig() {
      try {
        const request = create(GetConfigRequestSchema, {
          projectPath,
        })
        const response = await centyClient.getConfig(request)
        if (response.config) {
          setConfig(response.config)
          // Pre-select current value if it exists
          if (response.config.llm) {
            setSelectedOption(response.config.llm.updateStatusOnStart)
          }
        } else {
          setError(response.error || 'Failed to load project configuration')
        }
      } catch (err) {
        console.error('Failed to load config:', err)
        setError('Failed to load project configuration')
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [projectPath])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSave = useCallback(async () => {
    if (selectedOption === null || !config) return

    setSaving(true)
    setError(null)

    try {
      const updatedConfig = {
        ...config,
        llm: {
          autoCloseOnComplete: config.llm?.autoCloseOnComplete ?? false,
          updateStatusOnStart: selectedOption,
          allowDirectEdits: config.llm?.allowDirectEdits ?? false,
          defaultWorkspaceMode:
            config.llm?.defaultWorkspaceMode ?? WorkspaceMode.UNSPECIFIED,
          $typeName: 'centy.v1.LlmConfig' as const,
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
          {error && <div className="status-config-dialog-error">{error}</div>}

          {loading ? (
            <div className="status-config-dialog-loading">
              Loading configuration...
            </div>
          ) : (
            <>
              <p className="status-config-dialog-description">
                When an AI agent starts working on an issue, should the issue
                status be automatically updated to &quot;in-progress&quot;?
              </p>

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
                      Issue status will change to &quot;in-progress&quot; when
                      an agent starts working
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
                      Issue status will remain as-is when an agent starts
                      working
                    </span>
                  </div>
                </label>
              </div>
            </>
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
