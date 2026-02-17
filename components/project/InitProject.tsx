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
  type FileInfo,
  FileType,
} from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

type InitStep = 'input' | 'plan' | 'executing' | 'success' | 'error'

export function InitProject() {
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
    // Check if running in Tauri (which supports full path directory picking)
    setIsTauri(typeof window !== 'undefined' && '__TAURI__' in window)
  }, [])

  const handleSelectFolder = useCallback(async () => {
    if (!isTauri) return

    try {
      // Use Tauri's native file picker (provides full path)
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Project Folder',
      })
      if (selected) {
        setProjectPath(selected as string)
      }
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to select folder:', err)
      }
    }
  }, [isTauri])

  const handleQuickInit = useCallback(async () => {
    if (!projectPath.trim()) return

    setLoading(true)
    setError(null)

    try {
      const request = create(InitRequestSchema, {
        projectPath: projectPath.trim(),
        force: true,
      })
      const response = await centyClient.init(request)

      if (response.success) {
        setResult(response)
        setStep('success')
      } else {
        setError(response.error || 'Initialization failed')
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
      const request = create(GetReconciliationPlanRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.getReconciliationPlan(request)
      setPlan(response)
      setStep('plan')

      // Pre-select all files to restore by default
      setSelectedRestore(new Set(response.toRestore.map(f => f.path)))
      // Don't pre-select files to reset (safer default)
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

      const request = create(ExecuteReconciliationRequestSchema, {
        projectPath: projectPath.trim(),
        decisions,
      })
      const response = await centyClient.executeReconciliation(request)

      if (response.success) {
        setResult(response)
        setStep('success')
      } else {
        setError(response.error || 'Initialization failed')
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
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const toggleReset = useCallback((path: string) => {
    setSelectedReset(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
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

  const renderFileList = (files: FileInfo[], title: string) => {
    if (files.length === 0) return null

    return (
      <div className="file-list">
        <h4 className="file-list-title">{title}</h4>
        <ul className="file-list-items">
          {files.map(file => (
            <li key={file.path} className="file-list-item">
              <span className="file-icon">
                {file.fileType === FileType.DIRECTORY ? '📁' : '📄'}
              </span>
              <span className="file-path">{file.path}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderCheckboxList = (
    files: FileInfo[],
    title: string,
    selected: Set<string>,
    toggle: (path: string) => void,
    description: string
  ) => {
    if (files.length === 0) return null

    return (
      <div className="file-list checkbox-list">
        <h4 className="file-list-title">{title}</h4>
        <p className="description">{description}</p>
        <ul className="file-list-items">
          {files.map(file => (
            <li key={file.path} className="file-list-item">
              <label className="file-list-label">
                <input
                  className="file-list-checkbox"
                  type="checkbox"
                  checked={selected.has(file.path)}
                  onChange={() => toggle(file.path)}
                />
                <span className="file-icon">
                  {file.fileType === FileType.DIRECTORY ? '📁' : '📄'}
                </span>
                <span className="file-path">{file.path}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="init-project">
      <h2 className="init-project-title">Initialize Centy Project</h2>

      {step === 'input' && (
        <div className="input-step">
          <p className="input-step-description">
            Create a <code className="input-step-code">.centy</code> folder to
            track issues and documentation for your project.
          </p>

          <div className="path-input">
            <label className="path-input-label" htmlFor="project-path">
              Project Path:
            </label>
            <div className="input-row">
              <input
                className="path-input-field"
                id="project-path"
                type="text"
                value={projectPath}
                onChange={e => setProjectPath(e.target.value)}
                placeholder="/path/to/your/project"
              />
              {isTauri && (
                <button
                  type="button"
                  onClick={handleSelectFolder}
                  className="browse-btn"
                >
                  Browse...
                </button>
              )}
            </div>
          </div>

          <div className="actions">
            <button
              onClick={handleQuickInit}
              disabled={!projectPath.trim() || loading}
              className="primary"
            >
              {loading ? 'Initializing...' : 'Quick Init'}
            </button>
            <button
              onClick={handleGetPlan}
              disabled={!projectPath.trim() || loading}
              className="secondary"
            >
              {loading ? 'Loading...' : 'Review Changes'}
            </button>
          </div>
        </div>
      )}

      {step === 'plan' && plan && (
        <div className="plan-step">
          <h3 className="plan-step-title">Reconciliation Plan</h3>
          <p className="plan-step-description">
            Review what will happen when initializing{' '}
            <code className="plan-step-code">{projectPath}</code>
          </p>

          {renderFileList(plan.toCreate, 'Files to Create')}

          {renderCheckboxList(
            plan.toRestore,
            'Files to Restore',
            selectedRestore,
            toggleRestore,
            'These files were deleted but exist in the manifest. Select which to restore.'
          )}

          {renderCheckboxList(
            plan.toReset,
            'Files to Reset',
            selectedReset,
            toggleReset,
            'These files were modified. Select which to reset to original.'
          )}

          {renderFileList(plan.upToDate, 'Up to Date')}
          {renderFileList(plan.userFiles, 'User Files (unchanged)')}

          <div className="actions">
            <button onClick={handleReset} className="secondary">
              Cancel
            </button>
            <button
              onClick={handleExecutePlan}
              disabled={loading}
              className="primary"
            >
              {loading ? 'Executing...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      )}

      {step === 'executing' && (
        <div className="executing-step">
          <div className="spinner" />
          <p className="executing-step-message">Initializing project...</p>
        </div>
      )}

      {step === 'success' && result && (
        <div className="success-step">
          <h3 className="success-step-title">Success!</h3>
          <p className="success-step-description">
            Centy has been initialized in{' '}
            <code className="success-step-code">{projectPath}</code>
          </p>

          {result.created.length > 0 && (
            <div className="result-section">
              <h4 className="result-section-title">Created:</h4>
              <ul className="result-section-list">
                {result.created.map(path => (
                  <li key={path} className="result-section-item">
                    {path}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.restored.length > 0 && (
            <div className="result-section">
              <h4 className="result-section-title">Restored:</h4>
              <ul className="result-section-list">
                {result.restored.map(path => (
                  <li key={path} className="result-section-item">
                    {path}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.reset.length > 0 && (
            <div className="result-section">
              <h4 className="result-section-title">Reset:</h4>
              <ul className="result-section-list">
                {result.reset.map(path => (
                  <li key={path} className="result-section-item">
                    {path}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleReset} className="primary">
            Initialize Another Project
          </button>
        </div>
      )}

      {step === 'error' && (
        <div className="error-step">
          <h3 className="error-step-title">Error</h3>
          {error && <DaemonErrorMessage error={error} />}
          <button onClick={handleReset} className="primary">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
