'use client'

import { useState, useCallback } from 'react'
import { initProjectApi } from './initProjectApi'
import type { InitStep } from './InitProject.types'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'

const { runQuickInit, runGetPlan, runExecutePlan } = initProjectApi

interface UseInitStepsParams {
  projectPath: string
  setStep: (step: InitStep) => void
  setError: (error: string | null) => void
  setResult: (result: InitResponse) => void
  setPlan: (plan: ReconciliationPlan) => void
  setSelectedRestore: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedReset: React.Dispatch<React.SetStateAction<Set<string>>>
  selectedRestore: Set<string>
  selectedReset: Set<string>
}

export function useInitSteps({
  projectPath,
  setStep,
  setError,
  setResult,
  setPlan,
  setSelectedRestore,
  setSelectedReset,
  selectedRestore,
  selectedReset,
}: UseInitStepsParams) {
  const [loading, setLoading] = useState(false)

  const handleQuickInit = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const outcome = await runQuickInit(projectPath)
      if (outcome.success && outcome.result) {
        setResult(outcome.result)
        setStep('success')
      } else {
        setError(outcome.error || 'Initialization failed')
        setStep('error')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setStep('error')
    } finally {
      setLoading(false)
    }
  }, [projectPath, setError, setResult, setStep])

  const handleGetPlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { plan: fetchedPlan, restore } = await runGetPlan(projectPath)
      setPlan(fetchedPlan)
      setStep('plan')
      setSelectedRestore(new Set(restore))
      setSelectedReset(new Set())
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setStep('error')
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    setError,
    setPlan,
    setSelectedRestore,
    setSelectedReset,
    setStep,
  ])

  const handleExecutePlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setStep('executing')
    try {
      const outcome = await runExecutePlan(
        projectPath,
        selectedRestore,
        selectedReset
      )
      if (outcome.success && outcome.result) {
        setResult(outcome.result)
        setStep('success')
      } else {
        setError(outcome.error || 'Initialization failed')
        setStep('error')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setStep('error')
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    selectedRestore,
    selectedReset,
    setError,
    setResult,
    setStep,
  ])

  return { loading, handleQuickInit, handleGetPlan, handleExecutePlan }
}
