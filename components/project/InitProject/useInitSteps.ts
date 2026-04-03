'use client'

import { useState, useCallback } from 'react'
import { runQuickInitStep } from './runQuickInitStep'
import type { InitStep } from './InitProject.types'
import type { InitResponse } from '@/gen/centy_pb'

interface UseInitStepsParams {
  projectPath: string
  setStep: (step: InitStep) => void
  setError: (error: string | null) => void
  setResult: (result: InitResponse) => void
}

export function useInitSteps({
  projectPath,
  setStep,
  setError,
  setResult,
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

  return { loading, handleQuickInit }
}
