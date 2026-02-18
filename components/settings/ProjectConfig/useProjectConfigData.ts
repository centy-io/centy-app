'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Config, Manifest } from '@/gen/centy_pb'
import {
  checkProjectInitialized,
  fetchProjectData,
} from '@/components/settings/Settings/settingsApi'
import { useConfigMutations } from '@/components/settings/Settings/useConfigMutations'

export function useProjectConfigData(
  projectPath: string,
  isInitialized: boolean | null,
  setIsInitialized: (val: boolean | null) => void
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

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
    const timeoutId = setTimeout(async () => {
      const result = await checkProjectInitialized(projectPath)
      setIsInitialized(result)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, setIsInitialized])

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
