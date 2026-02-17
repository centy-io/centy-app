'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  GetDaemonInfoRequestSchema,
  UpdateConfigRequestSchema,
  ShutdownRequestSchema,
  RestartRequestSchema,
  IsInitializedRequestSchema,
  type Config,
  type Manifest,
  type DaemonInfo,
  type CustomFieldDefinition,
  type WorkspaceConfig,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { StateListEditor } from '@/components/settings/StateListEditor'
import { PriorityEditor } from '@/components/settings/PriorityEditor'
import { CustomFieldsEditor } from '@/components/settings/CustomFieldsEditor'
import { DefaultsEditor } from '@/components/settings/DefaultsEditor'
import { WorkspaceSettingsEditor } from '@/components/settings/WorkspaceSettingsEditor'
import { DaemonSettings } from '@/components/settings/DaemonSettings'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface ConfirmDialogProps {
  message: string
  danger?: boolean
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog({
  message,
  danger,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className={`confirm-dialog${danger ? ' danger' : ''}`}>
      <p>{message}</p>
      <div className="confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={danger ? 'confirm-danger-btn' : 'confirm-btn'}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

interface DaemonInfoSectionProps {
  daemonInfo: DaemonInfo | null
  restarting: boolean
  shuttingDown: boolean
  showRestartConfirm: boolean
  showShutdownConfirm: boolean
  onShowRestart: () => void
  onShowShutdown: () => void
  onHideRestart: () => void
  onHideShutdown: () => void
  onRestart: () => void
  onShutdown: () => void
}

function DaemonInfoSection({
  daemonInfo,
  restarting,
  shuttingDown,
  showRestartConfirm,
  showShutdownConfirm,
  onShowRestart,
  onShowShutdown,
  onHideRestart,
  onHideShutdown,
  onRestart,
  onShutdown,
}: DaemonInfoSectionProps) {
  return (
    <section className="settings-section">
      <h3>Daemon Information</h3>
      <div className="settings-card">
        {daemonInfo ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">{daemonInfo.version}</span>
            </div>
          </div>
        ) : (
          <div className="loading-inline">Loading daemon info...</div>
        )}

        <div className="daemon-controls">
          <button
            onClick={onShowRestart}
            className="restart-btn"
            disabled={restarting}
          >
            {restarting ? 'Restarting...' : 'Restart Daemon'}
          </button>
          <button
            onClick={onShowShutdown}
            className="shutdown-btn"
            disabled={shuttingDown}
          >
            {shuttingDown ? 'Shutting down...' : 'Shutdown Daemon'}
          </button>
        </div>

        {showRestartConfirm && (
          <ConfirmDialog
            message="Are you sure you want to restart the daemon?"
            confirmLabel="Yes, Restart"
            onCancel={onHideRestart}
            onConfirm={onRestart}
          />
        )}

        {showShutdownConfirm && (
          <ConfirmDialog
            message="Are you sure you want to shutdown the daemon? You will need to manually restart it."
            danger
            confirmLabel="Yes, Shutdown"
            onCancel={onHideShutdown}
            onConfirm={onShutdown}
          />
        )}
      </div>
    </section>
  )
}

interface ManifestSectionProps {
  manifest: Manifest | null
}

function ManifestSection({ manifest }: ManifestSectionProps) {
  if (!manifest) return null

  return (
    <div className="manifest-details">
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Schema Version</span>
          <span className="info-value">{manifest.schemaVersion}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Centy Version</span>
          <span className="info-value">{manifest.centyVersion}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Created</span>
          <span className="info-value">
            {manifest.createdAt
              ? new Date(manifest.createdAt).toLocaleString()
              : '-'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Updated</span>
          <span className="info-value">
            {manifest.updatedAt
              ? new Date(manifest.updatedAt).toLocaleString()
              : '-'}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ConfigEditorSectionsProps {
  config: Config
  updateConfig: (updates: Partial<Config>) => void
}

function StatesAndPrioritySections({
  config,
  updateConfig,
}: ConfigEditorSectionsProps) {
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
    </>
  )
}

function FieldsAndWorkspaceSections({
  config,
  updateConfig,
}: ConfigEditorSectionsProps) {
  return (
    <>
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
    </>
  )
}

interface SaveActionsProps {
  isDirty: boolean
  saving: boolean
  onReset: () => void
  onSave: () => void
}

function SaveActions({ isDirty, saving, onReset, onSave }: SaveActionsProps) {
  return (
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
  )
}

function useDaemonActions(
  setError: (error: string | null) => void,
  setSuccess: (success: string | null) => void
) {
  const [shuttingDown, setShuttingDown] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const handleShutdown = useCallback(async () => {
    setShuttingDown(true)
    setError(null)

    try {
      const request = create(ShutdownRequestSchema, {})
      const response = await centyClient.shutdown(request)

      if (response.success) {
        setSuccess(response.message || 'Daemon is shutting down...')
      } else {
        setError('Failed to shutdown daemon')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setShuttingDown(false)
      setShowShutdownConfirm(false)
    }
  }, [setError, setSuccess])

  const handleRestart = useCallback(async () => {
    setRestarting(true)
    setError(null)

    try {
      const request = create(RestartRequestSchema, {})
      const response = await centyClient.restart(request)

      if (response.success) {
        setSuccess(response.message || 'Daemon is restarting...')
      } else {
        setError('Failed to restart daemon')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setRestarting(false)
      setShowRestartConfirm(false)
    }
  }, [setError, setSuccess])

  return {
    shuttingDown,
    restarting,
    showShutdownConfirm,
    showRestartConfirm,
    setShowShutdownConfirm,
    setShowRestartConfirm,
    handleShutdown,
    handleRestart,
  }
}

function useDaemonInfo() {
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null)

  const fetchDaemonInfo = useCallback(async () => {
    try {
      const request = create(GetDaemonInfoRequestSchema, {})
      const response = await centyClient.getDaemonInfo(request)
      setDaemonInfo(response)
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

  useEffect(() => {
    fetchDaemonInfo()
  }, [fetchDaemonInfo])

  return daemonInfo
}

function useSettingsConfigData(
  projectPath: string,
  isInitialized: boolean | null,
  setError: (e: string | null) => void
) {
  const [config, setConfig] = useState<Config | null>(null)
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [loading, setLoading] = useState(false)

  const isDirty =
    config && originalConfig
      ? JSON.stringify(config) !== JSON.stringify(originalConfig)
      : false

  const fetchProjectData = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return

    setLoading(true)
    setError(null)

    try {
      const configRequest = create(GetConfigRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const configResponse = await centyClient.getConfig(configRequest)
      if (configResponse.config) {
        setConfig(configResponse.config)
        setOriginalConfig(structuredClone(configResponse.config))
      } else {
        setError(configResponse.error || 'Failed to load configuration')
      }

      const manifestRequest = create(GetManifestRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const manifestResponse = await centyClient.getManifest(manifestRequest)
      if (manifestResponse.manifest) {
        setManifest(manifestResponse.manifest)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized, setError])

  const updateConfig = useCallback(
    (updates: Partial<Config>) => {
      if (!config) return
      setConfig({ ...config, ...updates })
    },
    [config]
  )

  const handleResetConfig = useCallback(() => {
    if (!originalConfig) return
    setConfig(structuredClone(originalConfig))
  }, [originalConfig])

  return {
    config,
    manifest,
    loading,
    isDirty,
    fetchProjectData,
    updateConfig,
    handleResetConfig,
    setConfig,
    setOriginalConfig,
  }
}

function useSettingsConfigSave(
  projectPath: string,
  config: Config | null,
  setConfig: (c: Config) => void,
  setOriginalConfig: (c: Config) => void,
  setError: (e: string | null) => void,
  setSuccess: (s: string | null) => void
) {
  const [saving, setSaving] = useState(false)

  const handleSaveConfig = useCallback(async () => {
    if (!projectPath || !config) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const request = create(UpdateConfigRequestSchema, {
        projectPath: projectPath.trim(),
        config: config,
      })
      const response = await centyClient.updateConfig(request)

      if (response.success && response.config) {
        setSuccess('Configuration saved successfully')
        setConfig(response.config)
        setOriginalConfig(structuredClone(response.config))
      } else {
        setError(response.error || 'Failed to save configuration')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [projectPath, config, setConfig, setOriginalConfig, setError, setSuccess])

  return { saving, handleSaveConfig }
}

function useSettingsEffects(
  projectPath: string,
  isDirty: boolean,
  isInitialized: boolean | null,
  setIsInitialized: (v: boolean | null) => void,
  fetchProjectData: () => void
) {
  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }

      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInitialized])

  useEffect(() => {
    if (isInitialized !== true) return
    fetchProjectData()
  }, [isInitialized, fetchProjectData])
}

export function Settings() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const daemonInfo = useDaemonInfo()
  const daemonActions = useDaemonActions(setError, setSuccess)

  const configData = useSettingsConfigData(projectPath, isInitialized, setError)

  const { saving, handleSaveConfig } = useSettingsConfigSave(
    projectPath,
    configData.config,
    configData.setConfig,
    configData.setOriginalConfig,
    setError,
    setSuccess
  )

  useSettingsEffects(
    projectPath,
    configData.isDirty,
    isInitialized,
    setIsInitialized,
    configData.fetchProjectData
  )

  return (
    <SettingsLayout
      projectPath={projectPath}
      isInitialized={isInitialized}
      error={error}
      success={success}
      isDirty={configData.isDirty}
      daemonInfo={daemonInfo}
      daemonActions={daemonActions}
      loading={configData.loading}
      config={configData.config}
      manifest={configData.manifest}
      saving={saving}
      updateConfig={configData.updateConfig}
      handleResetConfig={configData.handleResetConfig}
      handleSaveConfig={handleSaveConfig}
    />
  )
}

interface SettingsLayoutProps {
  projectPath: string
  isInitialized: boolean | null
  error: string | null
  success: string | null
  isDirty: boolean
  daemonInfo: DaemonInfo | null
  daemonActions: ReturnType<typeof useDaemonActions>
  loading: boolean
  config: Config | null
  manifest: Manifest | null
  saving: boolean
  updateConfig: (updates: Partial<Config>) => void
  handleResetConfig: () => void
  handleSaveConfig: () => void
}

function SettingsLayout({
  projectPath,
  isInitialized,
  error,
  success,
  isDirty,
  daemonInfo,
  daemonActions,
  loading,
  config,
  manifest,
  saving,
  updateConfig,
  handleResetConfig,
  handleSaveConfig,
}: SettingsLayoutProps) {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        {isDirty && <span className="unsaved-indicator">Unsaved changes</span>}
      </div>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      <DaemonInfoSection
        daemonInfo={daemonInfo}
        restarting={daemonActions.restarting}
        shuttingDown={daemonActions.shuttingDown}
        showRestartConfirm={daemonActions.showRestartConfirm}
        showShutdownConfirm={daemonActions.showShutdownConfirm}
        onShowRestart={() => daemonActions.setShowRestartConfirm(true)}
        onShowShutdown={() => daemonActions.setShowShutdownConfirm(true)}
        onHideRestart={() => daemonActions.setShowRestartConfirm(false)}
        onHideShutdown={() => daemonActions.setShowShutdownConfirm(false)}
        onRestart={daemonActions.handleRestart}
        onShutdown={daemonActions.handleShutdown}
      />

      <section className="settings-section">
        <h3>Daemon Connection</h3>
        <div className="settings-card">
          <DaemonSettings />
        </div>
      </section>

      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view project settings</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/project/init">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <SettingsProjectContent
          projectPath={projectPath}
          loading={loading}
          config={config}
          manifest={manifest}
          isDirty={isDirty}
          saving={saving}
          updateConfig={updateConfig}
          handleResetConfig={handleResetConfig}
          handleSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  )
}

interface SettingsProjectContentProps {
  projectPath: string
  loading: boolean
  config: Config | null
  manifest: Manifest | null
  isDirty: boolean
  saving: boolean
  updateConfig: (updates: Partial<Config>) => void
  handleResetConfig: () => void
  handleSaveConfig: () => void
}

function SettingsProjectContent({
  projectPath,
  loading,
  config,
  manifest,
  isDirty,
  saving,
  updateConfig,
  handleResetConfig,
  handleSaveConfig,
}: SettingsProjectContentProps) {
  if (loading) {
    return <div className="loading">Loading project settings...</div>
  }

  return (
    <>
      <section className="settings-section">
        <h3>Project Title</h3>
        <div className="settings-card">
          <ProjectTitleEditor projectPath={projectPath} />
        </div>
      </section>

      {config && (
        <>
          <StatesAndPrioritySections
            config={config}
            updateConfig={updateConfig}
          />
          <FieldsAndWorkspaceSections
            config={config}
            updateConfig={updateConfig}
          />
          <SaveActions
            isDirty={isDirty}
            saving={saving}
            onReset={handleResetConfig}
            onSave={handleSaveConfig}
          />
        </>
      )}

      <section className="settings-section">
        <h3>Manifest</h3>
        <div className="settings-card">
          <ManifestSection manifest={manifest} />
        </div>
      </section>
    </>
  )
}
