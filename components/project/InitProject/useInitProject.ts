'use client'

import { useState, useCallback, useEffect } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { useInitSteps } from './useInitSteps'
import type { InitStep } from './InitProject.types'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'

function toggleSetItem(prev: Set<string>, path: string): Set<string> {
  const next = new Set(prev)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  return next
}

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
  const [plan, setPlan] = useState<ReconciliationPlan | null>(null)
  const [result, setResult] = useState<InitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedRestore, setSelectedRestore] = useState<Set<string>>(new Set())
  const [selectedReset, setSelectedReset] = useState<Set<string>>(new Set())
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
    setResult: r => setResult(r),
    setPlan: p => setPlan(p),
    setSelectedRestore,
    setSelectedReset,
    selectedRestore,
    selectedReset,
  })

  const toggleRestore = useCallback(
    (path: string) => setSelectedRestore(prev => toggleSetItem(prev, path)),
    []
  )

  const toggleReset = useCallback(
    (path: string) => setSelectedReset(prev => toggleSetItem(prev, path)),
    []
  )

  const handleReset = useCallback(() => {
    setStep('input')
    setPlan(null)
    setResult(null)
    setError(null)
    setSelectedRestore(new Set())
    setSelectedReset(new Set())
  }, [])

  return {
    projectPath,
    step,
    plan,
    result,
    error,
    selectedRestore,
    selectedReset,
    loading: steps.loading,
    isTauri,
    setProjectPath,
    handleSelectFolder,
    handleQuickInit: steps.handleQuickInit,
    handleGetPlan: steps.handleGetPlan,
    handleExecutePlan: steps.handleExecutePlan,
    toggleRestore,
    toggleReset,
    handleReset,
  }
}
