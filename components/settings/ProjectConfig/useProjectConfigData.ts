'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Config, Manifest } from '@/gen/centy_pb'
import { fetchProjectData } from '@/components/settings/Settings/settingsApi'
import { useConfigMutations } from '@/components/settings/Settings/useConfigMutations'

function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
}

interface ProjectDataSetters {
  setConfig: (c: Config | null) => void
  setOriginalConfig: (c: Config | null) => void
  setManifest: (m: Manifest | null) => void
  setLoading: (l: boolean) => void
  setError: (e: string | null) => void
}

async function loadProjectData(
  projectPath: string,
  isInitialized: boolean | null,
  setters: ProjectDataSetters
) {
  if (!projectPath.trim() || isInitialized !== true) return
  setters.setLoading(true)
  setters.setError(null)
  try {
    const result = await fetchProjectData(projectPath)
    if (result.error) setters.setError(result.error)
    if (result.config) {
      setters.setConfig(result.config)
      setters.setOriginalConfig(structuredClone(result.config))
    }
    if (result.manifest) setters.setManifest(result.manifest)
  } catch (err) {
    setters.setError(
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    )
  } finally {
    setters.setLoading(false)
  }
}

export function useProjectConfigData(
  projectPath: string,
  isInitialized: boolean | null
) {
  const [config, setConfig] = useState<Config | null>(null)
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isDirty =
    config && originalConfig
      ? JSON.stringify(config) !== JSON.stringify(originalConfig)
      : false

  useUnsavedChangesWarning(isDirty)

  const doFetchProjectData = useCallback(
    () =>
      loadProjectData(projectPath, isInitialized, {
        setConfig,
        setOriginalConfig,
        setManifest,
        setLoading,
        setError,
      }),
    [projectPath, isInitialized]
  )

  const mutations = useConfigMutations(projectPath, {
    config,
    setConfig,
    setOriginalConfig,
    originalConfig,
    setSaving,
    setError,
    setSuccess,
  })

  return {
    config,
    manifest,
    loading,
    saving,
    error,
    success,
    isDirty,
    setError,
    setSuccess,
    doFetchProjectData,
    ...mutations,
  }
}
