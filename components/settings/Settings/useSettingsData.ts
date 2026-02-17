import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetConfigRequestSchema,
  GetManifestRequestSchema,
  GetDaemonInfoRequestSchema,
  IsInitializedRequestSchema,
  type Config,
  type Manifest,
  type DaemonInfo,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'

export function useSettingsData() {
  const { projectPath, isInitialized, setIsInitialized } = useProject()

  const [config, setConfig] = useState<Config | null>(null)
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [daemonInfo, setDaemonInfo] = useState<DaemonInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isDirty =
    config && originalConfig
      ? JSON.stringify(config) !== JSON.stringify(originalConfig)
      : false

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

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

  const fetchDaemonInfo = useCallback(async () => {
    try {
      const request = create(GetDaemonInfoRequestSchema, {})
      const response = await centyClient.getDaemonInfo(request)
      setDaemonInfo(response)
    } catch (err) {
      console.error('Failed to fetch daemon info:', err)
    }
  }, [])

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
  }, [projectPath, isInitialized])

  useEffect(() => {
    fetchDaemonInfo()
  }, [fetchDaemonInfo])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkInitialized(projectPath)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [projectPath, checkInitialized])

  useEffect(() => {
    if (isInitialized === true) {
      fetchProjectData()
    }
  }, [isInitialized, fetchProjectData])

  return {
    projectPath,
    isInitialized,
    config,
    setConfig,
    originalConfig,
    setOriginalConfig,
    manifest,
    daemonInfo,
    loading,
    error,
    setError,
    success,
    setSuccess,
    isDirty,
  }
}
