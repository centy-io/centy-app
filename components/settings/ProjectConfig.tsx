'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  UpdateConfigRequestSchema,
  IsInitializedRequestSchema,
  GetProjectInfoRequestSchema,
  SetProjectOrganizationRequestSchema,
  type Config,
  type Manifest,
  type CustomFieldDefinition,
  type WorkspaceConfig,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useOrganization } from '@/components/providers/OrganizationProvider'
import { StateListEditor } from '@/components/settings/StateListEditor'
import { PriorityEditor } from '@/components/settings/PriorityEditor'
import { CustomFieldsEditor } from '@/components/settings/CustomFieldsEditor'
import { DefaultsEditor } from '@/components/settings/DefaultsEditor'
import { WorkspaceSettingsEditor } from '@/components/settings/WorkspaceSettingsEditor'
import { AgentConfigEditor } from '@/components/settings/AgentConfigEditor'
import { ProjectTitleEditor } from '@/components/settings/ProjectTitleEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

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

interface OrgSectionProps {
  projectOrgSlug: string
  savingOrg: boolean
  organizations: { slug: string; name: string }[]
  onOrgChange: (slug: string) => void
}

function OrgSection({
  projectOrgSlug,
  savingOrg,
  organizations,
  onOrgChange,
}: OrgSectionProps) {
  return (
    <section className="settings-section">
      <h3>Organization</h3>
      <div className="settings-card">
        <div className="form-group">
          <label htmlFor="project-org">Assign to Organization</label>
          <div className="org-select-row">
            <select
              id="project-org"
              value={projectOrgSlug}
              onChange={e => onOrgChange(e.target.value)}
              disabled={savingOrg}
              className="org-select"
            >
              <option value="">No Organization (Ungrouped)</option>
              {organizations.map(org => (
                <option key={org.slug} value={org.slug}>
                  {org.name}
                </option>
              ))}
            </select>
            {savingOrg && <span className="saving-indicator">Saving...</span>}
          </div>
          <span className="form-hint">
            Group this project under an organization for better management.{' '}
            <Link href="/organizations">Manage organizations</Link>
          </span>
        </div>
      </div>
    </section>
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
            fields={config.customFields}
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
            value={config.workspace}
            onChange={workspace => updateConfig({ workspace })}
          />
        </div>
      </section>
    </>
  )
}

function ConfigEditorSections({
  config,
  updateConfig,
}: ConfigEditorSectionsProps) {
  return (
    <>
      <StatesAndPrioritySections config={config} updateConfig={updateConfig} />
      <FieldsAndWorkspaceSections config={config} updateConfig={updateConfig} />
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

function useProjectOrg(
  projectPath: string,
  setError: (e: string | null) => void,
  setSuccess: (s: string | null) => void
) {
  const { organizations, refreshOrganizations } = useOrganization()
  const [projectOrgSlug, setProjectOrgSlug] = useState<string>('')
  const [savingOrg, setSavingOrg] = useState(false)

  const fetchProjectOrg = useCallback(async () => {
    if (!projectPath.trim()) return

    try {
      const request = create(GetProjectInfoRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.getProjectInfo(request)
      if (response.found && response.project) {
        setProjectOrgSlug(response.project.organizationSlug || '')
      }
    } catch (err) {
      console.error('Failed to fetch project organization:', err)
    }
  }, [projectPath])

  const handleOrgChange = useCallback(
    async (newOrgSlug: string) => {
      if (!projectPath.trim()) return

      setSavingOrg(true)
      setError(null)
      setSuccess(null)

      try {
        const request = create(SetProjectOrganizationRequestSchema, {
          projectPath: projectPath.trim(),
          organizationSlug: newOrgSlug,
        })
        const response = await centyClient.setProjectOrganization(request)

        if (response.success) {
          setProjectOrgSlug(newOrgSlug)
          setSuccess(
            newOrgSlug
              ? 'Project assigned to organization'
              : 'Project removed from organization'
          )
          refreshOrganizations()
        } else {
          setError(response.error || 'Failed to update organization')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setSavingOrg(false)
      }
    },
    [projectPath, refreshOrganizations, setError, setSuccess]
  )

  return {
    organizations,
    projectOrgSlug,
    savingOrg,
    fetchProjectOrg,
    handleOrgChange,
  }
}

function useCheckInitialized() {
  const { isInitialized, setIsInitialized } = useProject()

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

  return { isInitialized, checkInitialized }
}

function useFetchProjectData(
  projectPath: string,
  isInitialized: boolean | null,
  setError: (e: string | null) => void,
  setConfig: (c: Config) => void,
  setOriginalConfig: (c: Config) => void,
  setManifest: (m: Manifest) => void
) {
  const [loading, setLoading] = useState(false)

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
  }, [
    projectPath,
    isInitialized,
    setError,
    setConfig,
    setOriginalConfig,
    setManifest,
  ])

  return { loading, fetchProjectData }
}

function useProjectConfigData(
  projectPath: string,
  setError: (e: string | null) => void
) {
  const { isInitialized, checkInitialized } = useCheckInitialized()
  const [config, setConfig] = useState<Config | null>(null)
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)

  const isDirty =
    config && originalConfig
      ? JSON.stringify(config) !== JSON.stringify(originalConfig)
      : false

  const { loading, fetchProjectData } = useFetchProjectData(
    projectPath,
    isInitialized,
    setError,
    setConfig,
    setOriginalConfig,
    setManifest
  )

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
    isInitialized,
    config,
    manifest,
    loading,
    isDirty,
    checkInitialized,
    fetchProjectData,
    updateConfig,
    handleResetConfig,
    setConfig,
    setOriginalConfig,
  }
}

function useProjectConfigSave(
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

function useProjectConfigEffects(
  projectPath: string,
  isDirty: boolean,
  isInitialized: boolean | null,
  checkInitialized: (path: string) => void,
  fetchProjectData: () => void,
  fetchProjectOrg: () => void
) {
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
    fetchProjectOrg()
  }, [isInitialized, fetchProjectData, fetchProjectOrg])
}

export function ProjectConfig() {
  const { projectPath } = useProject()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const configData = useProjectConfigData(projectPath, setError)

  const { saving, handleSaveConfig } = useProjectConfigSave(
    projectPath,
    configData.config,
    configData.setConfig,
    configData.setOriginalConfig,
    setError,
    setSuccess
  )

  const orgState = useProjectOrg(projectPath, setError, setSuccess)

  useProjectConfigEffects(
    projectPath,
    configData.isDirty,
    configData.isInitialized,
    configData.checkInitialized,
    configData.fetchProjectData,
    orgState.fetchProjectOrg
  )

  return (
    <ProjectConfigLayout
      projectPath={projectPath}
      error={error}
      success={success}
      isDirty={configData.isDirty}
      isInitialized={configData.isInitialized}
      loading={configData.loading}
      config={configData.config}
      manifest={configData.manifest}
      saving={saving}
      orgState={orgState}
      updateConfig={configData.updateConfig}
      handleResetConfig={configData.handleResetConfig}
      handleSaveConfig={handleSaveConfig}
    />
  )
}

interface ProjectConfigLayoutProps {
  projectPath: string
  error: string | null
  success: string | null
  isDirty: boolean
  isInitialized: boolean | null
  loading: boolean
  config: Config | null
  manifest: Manifest | null
  saving: boolean
  orgState: {
    organizations: { slug: string; name: string }[]
    projectOrgSlug: string
    savingOrg: boolean
    handleOrgChange: (slug: string) => void
  }
  updateConfig: (updates: Partial<Config>) => void
  handleResetConfig: () => void
  handleSaveConfig: () => void
}

function ProjectConfigLayout({
  projectPath,
  error,
  success,
  isDirty,
  isInitialized,
  loading,
  config,
  manifest,
  saving,
  orgState,
  updateConfig,
  handleResetConfig,
  handleSaveConfig,
}: ProjectConfigLayoutProps) {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Project Configuration</h2>
        {isDirty && <span className="unsaved-indicator">Unsaved changes</span>}
      </div>

      {error && <DaemonErrorMessage error={error} />}
      {success && <div className="success-message">{success}</div>}

      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view project configuration</p>
        </div>
      )}

      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}

      {projectPath && isInitialized === true && (
        <ProjectConfigContent
          projectPath={projectPath}
          loading={loading}
          config={config}
          manifest={manifest}
          isDirty={isDirty}
          saving={saving}
          orgState={orgState}
          updateConfig={updateConfig}
          handleResetConfig={handleResetConfig}
          handleSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  )
}

interface ProjectConfigContentProps {
  projectPath: string
  loading: boolean
  config: Config | null
  manifest: Manifest | null
  isDirty: boolean
  saving: boolean
  orgState: {
    organizations: { slug: string; name: string }[]
    projectOrgSlug: string
    savingOrg: boolean
    handleOrgChange: (slug: string) => void
  }
  updateConfig: (updates: Partial<Config>) => void
  handleResetConfig: () => void
  handleSaveConfig: () => void
}

function ProjectConfigContent({
  projectPath,
  loading,
  config,
  manifest,
  isDirty,
  saving,
  orgState,
  updateConfig,
  handleResetConfig,
  handleSaveConfig,
}: ProjectConfigContentProps) {
  if (loading) {
    return <div className="loading">Loading project configuration...</div>
  }

  return (
    <>
      <OrgSection
        projectOrgSlug={orgState.projectOrgSlug}
        savingOrg={orgState.savingOrg}
        organizations={orgState.organizations}
        onOrgChange={orgState.handleOrgChange}
      />

      <section className="settings-section">
        <h3>Project Title</h3>
        <div className="settings-card">
          <ProjectTitleEditor projectPath={projectPath} />
        </div>
      </section>

      {config && (
        <>
          <ConfigEditorSections config={config} updateConfig={updateConfig} />
          <SaveActions
            isDirty={isDirty}
            saving={saving}
            onReset={handleResetConfig}
            onSave={handleSaveConfig}
          />
        </>
      )}

      <section className="settings-section">
        <h3>Agent Configuration</h3>
        <div className="settings-card">
          <AgentConfigEditor />
        </div>
      </section>

      <section className="settings-section">
        <h3>Manifest</h3>
        <div className="settings-card">
          <ManifestSection manifest={manifest} />
        </div>
      </section>
    </>
  )
}
