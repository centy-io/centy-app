'use client'

import { useState, useCallback, useEffect } from 'react'
import { fetchProjectData } from './settingsApi'
import { useConfigMutations } from './useConfigMutations'
import type { Config, Manifest } from '@/gen/centy_pb'

function useUnsavedWarning(isDirty: boolean): void {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])
}

export function useSettingsData(
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

  useUnsavedWarning(isDirty)

  const doFetchProjectData = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchProjectData(projectPath)
      if (result.error) {
        setError(result.error)
      }
      if (result.config) {
        setConfig(result.config)
        setOriginalConfig(structuredClone(result.config))
      }
      if (result.manifest) {
        setManifest(result.manifest)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  const mutations = useConfigMutations(projectPath, {
    config,
    setConfig,
    setOriginalConfig,
    originalConfig,
    setSaving,
    setError,
    setSuccess,
  })

  useEffect(() => {
    if (isInitialized === true) {
      void doFetchProjectData()
    }
  }, [isInitialized, doFetchProjectData])

  return {
    config,
    manifest,
    loading,
    saving,
    error,
    success,
    isDirty,
    ...mutations,
  }
}
