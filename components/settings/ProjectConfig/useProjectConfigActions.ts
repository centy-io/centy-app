import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateConfigRequestSchema, type Config } from '@/gen/centy_pb'
import type { UseProjectConfigActionsParams } from './ProjectConfig.types'

export function useProjectConfigActions({
  projectPath,
  config,
  originalConfig,
  setConfig,
  setOriginalConfig,
  setError,
  setSuccess,
}: UseProjectConfigActionsParams) {
  const [saving, setSaving] = useState(false)

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

  const updateConfig = useCallback(
    (updates: Partial<Config>) => {
      if (!config) return
      setConfig({ ...config, ...updates })
    },
    [config, setConfig]
  )

  return { saving, handleSaveConfig, handleResetConfig, updateConfig }
}
