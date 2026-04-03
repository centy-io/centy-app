'use client'

import { useState, useCallback, useEffect } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { useInitSteps } from './useInitSteps'
import type { InitStep } from './InitProject.types'
import type { InitResponse } from '@/gen/centy_pb'

async function selectFolder(
  isTauri: boolean,
  setProjectPath: (path: string) => void
): Promise<void> {
  if (!isTauri) return
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Select Project Folder',
    })
    if (selected) setProjectPath(selected)
  } catch (err) {
    if (!(err instanceof Error) || err.name !== 'AbortError')
      console.error('Failed to select folder:', err)
  }
}

export function useInitProject() {
  const [projectPath, setProjectPath] = useState('')
  const [step, setStep] = useState<InitStep>('input')
  const [result, setResult] = useState<InitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    setIsTauri(typeof window !== 'undefined' && '__TAURI__' in window)
  }, [])

  const handleSelectFolder = useCallback(
    () => selectFolder(isTauri, setProjectPath),
    [isTauri]
  )

  const steps = useInitSteps({
    projectPath,
    setStep,
    setError,
    setResult: r => {
      setResult(r)
    },
  })

  const handleReset = useCallback(() => {
    setStep('input')
    setResult(null)
    setError(null)
  }, [])

  return {
    projectPath,
    step,
    result,
    error,
    loading: steps.loading,
    isTauri,
    setProjectPath,
    handleSelectFolder,
    handleQuickInit: steps.handleQuickInit,
    handleReset,
  }
}
