import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateConfigRequestSchema, type Config } from '@/gen/centy_pb'
import type { UseSettingsActionsParams } from './Settings.types'
import { performShutdown, performRestart } from './daemonActions'

export function useSettingsActions({
  projectPath,
  config,
  originalConfig,
  setConfig,
  setOriginalConfig,
  setError,
  setSuccess,
}: UseSettingsActionsParams) {
  const [saving, setSaving] = useState(false)
  const [shuttingDown, setShuttingDown] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const handleSaveConfig = useCallback(async () => {
    if (!projectPath || !config) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const request = create(UpdateConfigRequestSchema, {
        projectPath: projectPath.trim(),
        config,
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

  const handleResetConfig = useCallback(() => {
    if (originalConfig) {
      setConfig(structuredClone(originalConfig))
    }
  }, [originalConfig, setConfig])

  const handleShutdown = useCallback(async () => {
    setShuttingDown(true)
    await performShutdown({ setError, setSuccess })
    setShuttingDown(false)
    setShowShutdownConfirm(false)
  }, [setError, setSuccess])

  const handleRestart = useCallback(async () => {
    setRestarting(true)
    await performRestart({ setError, setSuccess })
    setRestarting(false)
    setShowRestartConfirm(false)
  }, [setError, setSuccess])

  const updateConfig = useCallback(
    (updates: Partial<Config>) => {
      if (!config) return
      setConfig({ ...config, ...updates })
    },
    [config, setConfig]
  )

  return {
    saving,
    shuttingDown,
    restarting,
    showShutdownConfirm,
    showRestartConfirm,
    setShowShutdownConfirm,
    setShowRestartConfirm,
    handleSaveConfig,
    handleResetConfig,
    handleShutdown,
    handleRestart,
    updateConfig,
  }
}
