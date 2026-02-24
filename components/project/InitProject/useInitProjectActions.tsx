'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { useExecutePlan } from './useExecutePlan'
import type { InitStep } from './InitProject.types'
import { centyClient } from '@/lib/grpc/client'
import {
  InitRequestSchema,
  GetReconciliationPlanRequestSchema,
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
  const {
    projectPath,
    setLoading,
    setError,
    setStep,
    setPlan,
    setResult,
    setSelectedRestore,
    setSelectedReset,
  } = state

  const { handleExecutePlan } = useExecutePlan(state)

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

  const handleGetPlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await centyClient.getReconciliationPlan(
        create(GetReconciliationPlanRequestSchema, {
          projectPath: projectPath.trim(),
        })
      )
      setPlan(res)
      setStep('plan')
      setSelectedRestore(new Set(res.toRestore.map(f => f.path)))
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
    setLoading,
    setError,
    setPlan,
    setStep,
    setSelectedRestore,
    setSelectedReset,
  ])

  return { handleQuickInit, handleGetPlan, handleExecutePlan }
}
