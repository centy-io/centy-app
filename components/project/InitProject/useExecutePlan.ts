'use client'

import { useCallback } from 'react'
import { executeReconciliation } from './initProjectActions'
import { extractError, type InitHandlerSetters } from './useInitHandlers'

export function useExecutePlan(
  projectPath: string,
  selectedRestore: Set<string>,
  selectedReset: Set<string>,
  s: InitHandlerSetters
) {
  return useCallback(async () => {
    if (!projectPath.trim()) return
    s.setLoading(true)
    s.setStep('executing')
    try {
      const res = await executeReconciliation(
        projectPath,
        selectedRestore,
        selectedReset
      )
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
  }, [projectPath, selectedRestore, selectedReset, s])
}
