'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import type { InitStep } from './InitProject.types'
import { centyClient } from '@/lib/grpc/client'
import {
  GetReconciliationPlanRequestSchema,
  type ReconciliationPlan,
} from '@/gen/centy_pb'

interface GetPlanState {
  projectPath: string
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setStep: (v: InitStep) => void
  setPlan: (v: ReconciliationPlan | null) => void
  setSelectedRestore: (v: Set<string>) => void
  setSelectedReset: (v: Set<string>) => void
}

export function useGetPlan(state: GetPlanState) {
  const {
    projectPath,
    setLoading,
    setError,
    setStep,
    setPlan,
    setSelectedRestore,
    setSelectedReset,
  } = state

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

  return { handleGetPlan }
}
