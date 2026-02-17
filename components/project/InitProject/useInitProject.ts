'use client'

import { useState, useCallback, useEffect } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'
import type { InitStep } from './InitProject.types'
import { useInitHandlers } from './useInitHandlers'

export function useInitProject() {
  const [projectPath, setProjectPath] = useState('')
  const [step, setStep] = useState<InitStep>('input')
  const [plan, setPlan] = useState<ReconciliationPlan | null>(null)
  const [result, setResult] = useState<InitResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedRestore, setSelectedRestore] = useState<Set<string>>(new Set())
  const [selectedReset, setSelectedReset] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [isTauri, setIsTauri] = useState(false)

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
      if (selected) setProjectPath(selected as string)
    } catch (err) {
      if ((err as Error).name !== 'AbortError')
        console.error('Failed to select folder:', err)
    }
  }, [isTauri])

  const toggleRestore = useCallback((path: string) => {
    setSelectedRestore(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])
  const toggleReset = useCallback((path: string) => {
    setSelectedReset(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const { handleQuickInit, handleGetPlan, handleExecutePlan, handleReset } =
    useInitHandlers(projectPath, selectedRestore, selectedReset, {
      setStep,
      setLoading,
      setError,
      setResult,
      setPlan,
      setSelectedRestore,
      setSelectedReset,
    })

  return {
    projectPath,
    setProjectPath,
    step,
    plan,
    result,
    error,
    selectedRestore,
    selectedReset,
    loading,
    isTauri,
    handleSelectFolder,
    handleQuickInit,
    handleGetPlan,
    handleExecutePlan,
    toggleRestore,
    toggleReset,
    handleReset,
  }
}
