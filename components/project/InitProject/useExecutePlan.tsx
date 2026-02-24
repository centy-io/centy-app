'use client'

import { useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import type { InitStep } from './InitProject.types'
import { centyClient } from '@/lib/grpc/client'
import {
  ExecuteReconciliationRequestSchema,
  ReconciliationDecisionsSchema,
  type InitResponse,
} from '@/gen/centy_pb'

interface ExecutePlanState {
  projectPath: string
  selectedRestore: Set<string>
  selectedReset: Set<string>
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setStep: (v: InitStep) => void
  setResult: (v: InitResponse | null) => void
}

export function useExecutePlan(state: ExecutePlanState) {
  const {
    projectPath,
    selectedRestore,
    selectedReset,
    setLoading,
    setError,
    setStep,
    setResult,
  } = state

  const handleExecutePlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setStep('executing')
    try {
      const decisions = create(ReconciliationDecisionsSchema, {
        restore: Array.from(selectedRestore),
        reset: Array.from(selectedReset),
      })
      const res = await centyClient.executeReconciliation(
        create(ExecuteReconciliationRequestSchema, {
          projectPath: projectPath.trim(),
          decisions,
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
  }, [
    projectPath,
    selectedRestore,
    selectedReset,
    setLoading,
    setStep,
    setResult,
    setError,
  ])

  return { handleExecutePlan }
}
