'use client'

import { useCallback } from 'react'
import type { Config } from '@/gen/centy_pb'
import { saveConfig } from './settingsApi'

interface ConfigState {
  config: Config | null
  setConfig: (c: Config | null) => void
  setOriginalConfig: (c: Config | null) => void
  originalConfig: Config | null
  setSaving: (s: boolean) => void
  setError: (e: string | null) => void
  setSuccess: (s: string | null) => void
}

export function useConfigMutations(projectPath: string, state: ConfigState) {
  const {
    config,
    setConfig,
    setOriginalConfig,
    originalConfig,
    setSaving,
    setError,
    setSuccess,
  } = state

  const handleSaveConfig = useCallback(async () => {
    if (!projectPath || !config) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await saveConfig(projectPath, config)
      if (result.config) {
        setSuccess('Configuration saved successfully')
        setConfig(result.config)
        setOriginalConfig(structuredClone(result.config))
      } else {
        setError(result.error || 'Failed to save configuration')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    config,
    setConfig,
    setOriginalConfig,
    setSaving,
    setError,
    setSuccess,
  ])

  const handleResetConfig = useCallback(() => {
    if (originalConfig) {
      setConfig(structuredClone(originalConfig))
    }
  }, [originalConfig, setConfig])

  const updateConfig = useCallback(
    (updates: Partial<Config>) => {
      if (!config) return
      setConfig({ ...config, ...updates })
    },
    [config, setConfig]
  )

  return {
    handleSaveConfig,
    handleResetConfig,
    updateConfig,
  }
}
