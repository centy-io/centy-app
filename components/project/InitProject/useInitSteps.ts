'use client'

import { useState, useCallback } from 'react'
import { runQuickInitStep } from './runQuickInitStep'
import { runGetPlanStep } from './runGetPlanStep'
import { runExecutePlanStep } from './runExecutePlanStep'
import type { InitStep } from './InitProject.types'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'

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

  const handleQuickInit = useCallback(
    () =>
      runQuickInitStep({
        projectPath,
        setLoading,
        setError,
        setResult,
        setStep,
      }),
    [projectPath, setError, setResult, setStep]
  )

  const handleGetPlan = useCallback(
    () =>
      runGetPlanStep({
        projectPath,
        setLoading,
        setError,
        setPlan,
        setStep,
        setSelectedRestore,
        setSelectedReset,
      }),
    [
      projectPath,
      setError,
      setPlan,
      setSelectedRestore,
      setSelectedReset,
      setStep,
    ]
  )

  const handleExecutePlan = useCallback(
    () =>
      runExecutePlanStep({
        projectPath,
        selectedRestore,
        selectedReset,
        setLoading,
        setError,
        setResult,
        setStep,
      }),
    [projectPath, selectedRestore, selectedReset, setError, setResult, setStep]
  )

  return { loading, handleQuickInit, handleGetPlan, handleExecutePlan }
}
