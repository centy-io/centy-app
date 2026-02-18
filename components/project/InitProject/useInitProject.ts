/* eslint-disable max-lines */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  InitRequestSchema,
  GetReconciliationPlanRequestSchema,
  ExecuteReconciliationRequestSchema,
  ReconciliationDecisionsSchema,
  type ReconciliationPlan,
  type InitResponse,
} from '@/gen/centy_pb'
import type { InitStep } from './InitProject.types'

// eslint-disable-next-line max-lines-per-function
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
      if (selected) setProjectPath(selected)
    } catch (err) {
      if (!(err instanceof Error) || err.name !== 'AbortError')
        console.error('Failed to select folder:', err)
    }
  }, [isTauri])

  const handleQuickInit = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const req = create(InitRequestSchema, {
        projectPath: projectPath.trim(),
        force: true,
      })
      const res = await centyClient.init(req)
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
  }, [projectPath])

  const handleGetPlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setError(null)
    try {
      const req = create(GetReconciliationPlanRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const res = await centyClient.getReconciliationPlan(req)
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
  }, [projectPath])

  const handleExecutePlan = useCallback(async () => {
    if (!projectPath.trim()) return
    setLoading(true)
    setStep('executing')
    try {
      const decisions = create(ReconciliationDecisionsSchema, {
        restore: Array.from(selectedRestore),
        reset: Array.from(selectedReset),
      })
      const req = create(ExecuteReconciliationRequestSchema, {
        projectPath: projectPath.trim(),
        decisions,
      })
      const res = await centyClient.executeReconciliation(req)
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
  }, [projectPath, selectedRestore, selectedReset])

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

  const handleReset = useCallback(() => {
    setStep('input')
    setPlan(null)
    setResult(null)
    setError(null)
    setSelectedRestore(new Set())
    setSelectedReset(new Set())
  }, [])

  return {
    projectPath,
    step,
    plan,
    result,
    error,
    selectedRestore,
    selectedReset,
    loading,
    isTauri,
    setProjectPath,
    handleSelectFolder,
    handleQuickInit,
    handleGetPlan,
    handleExecutePlan,
    toggleRestore,
    toggleReset,
    handleReset,
  }
}
