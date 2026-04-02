import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { useModalDismiss } from './useModalDismiss'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  UpdateConfigRequestSchema,
  type Config,
} from '@/gen/centy_pb'

async function fetchConfig(projectPath: string): Promise<{
  config: Config | null
  error: string | null
}> {
  const request = create(GetConfigRequestSchema, { projectPath })
  const response = await centyClient.getConfig(request)
  if (response.config) {
    return { config: response.config, error: null }
  }
  return {
    config: null,
    error: response.error || 'Failed to load project configuration',
  }
}

function getInitialSelectedOption(config: Config): boolean {
  if (config.workspace) {
    return config.workspace.updateStatusOnOpen !== undefined
      ? config.workspace.updateStatusOnOpen
      : false
  }
  return false
}

export function useStatusConfig(
  projectPath: string,
  onClose: () => void,
  onConfigured: () => void
) {
  const modalRef = useRef<HTMLDivElement>(null)

  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null)

  useModalDismiss(modalRef, onClose)

  useEffect(() => {
    async function loadConfig() {
      try {
        const result = await fetchConfig(projectPath)
        if (result.config) {
          setConfig(result.config)
          setSelectedOption(getInitialSelectedOption(result.config))
        } else {
          setError(result.error)
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

  return {
    modalRef,
    loading,
    saving,
    error,
    selectedOption,
    setSelectedOption,
    handleSave,
  }
}
