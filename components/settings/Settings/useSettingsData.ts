import { useState, useCallback, useEffect } from 'react'
import { type Config, type Manifest, type DaemonInfo } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import {
  fetchSettingsProjectData,
  fetchDaemonInfoData,
} from './fetchSettingsData'
import { checkProjectInitialized } from './checkInitialized'

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
    (path: string) => checkProjectInitialized(path, setIsInitialized),
    [setIsInitialized]
  )

  const fetchProjectData = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSettingsProjectData(projectPath)
      if (result.error) {
        setError(result.error)
      } else if (result.config) {
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

  useEffect(() => {
    fetchDaemonInfoData().then(info => {
      if (info) setDaemonInfo(info)
    })
  }, [])

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
