'use client'

import { useState, useCallback, useEffect } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { useInitProjectActions } from './useInitProjectActions'
import { useInitProjectSelections } from './useInitProjectSelections'
import type { InitStep } from './InitProject.types'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'

export function useInitProject() {
  const [projectPath, setProjectPath] = useState('')
  const [step, setStep] = useState<InitStep>('input')
  const [plan, setPlan] = useState<ReconciliationPlan | null>(null)
  const [result, setResult] = useState<InitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isTauri, setIsTauri] = useState(false)
  const selections = useInitProjectSelections()
  const actions = useInitProjectActions({
    projectPath,
    selectedRestore: selections.selectedRestore,
    selectedReset: selections.selectedReset,
    setLoading,
    setError,
    setStep,
    setPlan,
    setResult,
    setSelectedRestore: selections.setSelectedRestore,
    setSelectedReset: selections.setSelectedReset,
  })

  useEffect(() => {
    setIsTauri(typeof window !== 'undefined' && '__TAURI__' in window)
  }, [])

  const handleSelectFolder = useCallback(async () => {
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
  }, [isTauri])

  const handleReset = useCallback(() => {
    setStep('input')
    setPlan(null)
    setResult(null)
    setError(null)
    selections.setSelectedRestore(new Set())
    selections.setSelectedReset(new Set())
  }, [selections])

  return {
    projectPath,
    step,
    plan,
    result,
    error,
    loading,
    isTauri,
    setProjectPath,
    handleSelectFolder,
    handleReset,
    ...selections,
    ...actions,
  }
}
