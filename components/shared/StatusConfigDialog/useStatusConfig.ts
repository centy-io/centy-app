import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  UpdateConfigRequestSchema,
  type Config,
} from '@/gen/centy_pb'
import { useModalDismiss } from '@/components/shared/useModalDismiss'

export function useStatusConfig(
  projectPath: string,
  onClose: () => void,
  onConfigured: () => void
) {
  const modalRef = useModalDismiss(onClose)
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null)

  useEffect(() => {
    async function loadConfig() {
      try {
        const request = create(GetConfigRequestSchema, { projectPath })
        const response = await centyClient.getConfig(request)
        if (response.config) {
          setConfig(response.config)
          if (response.config.workspace) {
            setSelectedOption(
              response.config.workspace.updateStatusOnOpen ?? false
            )
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
