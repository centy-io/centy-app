'use client'

import { useCallback } from 'react'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'
import type { InitStep } from './InitProject.types'
import { quickInit, getReconciliationPlan } from './initProjectActions'
import { useExecutePlan } from './useExecutePlan'

export interface InitHandlerSetters {
  setStep: (s: InitStep) => void
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setResult: (v: InitResponse | null) => void
  setPlan: (v: ReconciliationPlan | null) => void
  setSelectedRestore: (v: Set<string>) => void
  setSelectedReset: (v: Set<string>) => void
}

export function extractError(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

export function useInitHandlers(
  projectPath: string,
  selectedRestore: Set<string>,
  selectedReset: Set<string>,
  s: InitHandlerSetters
) {
  const handleQuickInit = useCallback(async () => {
    if (!projectPath.trim()) return
    s.setLoading(true)
    s.setError(null)
    try {
      const res = await quickInit(projectPath)
      if (res.success) {
        s.setResult(res)
        s.setStep('success')
      } else {
        s.setError(res.error || 'Initialization failed')
        s.setStep('error')
      }
    } catch (err) {
      s.setError(extractError(err))
      s.setStep('error')
    } finally {
      s.setLoading(false)
    }
  }, [projectPath, s])

  const handleGetPlan = useCallback(async () => {
    if (!projectPath.trim()) return
    s.setLoading(true)
    s.setError(null)
    try {
      const res = await getReconciliationPlan(projectPath)
      s.setPlan(res)
      s.setStep('plan')
      s.setSelectedRestore(new Set(res.toRestore.map(f => f.path)))
      s.setSelectedReset(new Set())
    } catch (err) {
      s.setError(extractError(err))
      s.setStep('error')
    } finally {
      s.setLoading(false)
    }
  }, [projectPath, s])

  const handleExecutePlan = useExecutePlan(
    projectPath,
    selectedRestore,
    selectedReset,
    s
  )

  const handleReset = useCallback(() => {
    s.setStep('input')
    s.setPlan(null)
    s.setResult(null)
    s.setError(null)
    s.setSelectedRestore(new Set())
    s.setSelectedReset(new Set())
  }, [s])

  return { handleQuickInit, handleGetPlan, handleExecutePlan, handleReset }
}
