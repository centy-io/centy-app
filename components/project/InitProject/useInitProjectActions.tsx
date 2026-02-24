'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { useExecutePlan } from './useExecutePlan'
import { useGetPlan } from './useGetPlan'
import type { InitStep } from './InitProject.types'
import { centyClient } from '@/lib/grpc/client'
import {
  InitRequestSchema,
  type ReconciliationPlan,
  type InitResponse,
} from '@/gen/centy_pb'

interface InitActionsState {
  projectPath: string
  selectedRestore: Set<string>
  selectedReset: Set<string>
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setStep: (v: InitStep) => void
  setPlan: (v: ReconciliationPlan | null) => void
  setResult: (v: InitResponse | null) => void
  setSelectedRestore: (v: Set<string>) => void
  setSelectedReset: (v: Set<string>) => void
}

export function useInitProjectActions(state: InitActionsState) {
  const { projectPath, setLoading, setError, setStep, setResult } = state
  const { handleExecutePlan } = useExecutePlan(state)
  const { handleGetPlan } = useGetPlan(state)

  const handleQuickInit = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await centyClient.init(
        create(InitRequestSchema, {
          projectPath: projectPath.trim(),
          force: true,
        })
      )
      if (res.success) {
        setResult(res)
        setStep('success')
      } else {
        setError(res.error || 'Initialization failed')
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
  }, [projectPath, setLoading, setError, setResult, setStep])

  return { handleQuickInit, handleGetPlan, handleExecutePlan }
}
