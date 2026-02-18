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

function FileList({ files, title }: { files: FileInfo[]; title: string }) {
  if (files.length === 0) return null

  return (
    <div className="file-list">
      <h4>{title}</h4>
      <ul>
        {files.map(file => (
          <li key={file.path}>
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

function CheckboxList({
  files,
  title,
  selected,
  toggle,
  description,
}: {
  files: FileInfo[]
  title: string
  selected: Set<string>
  toggle: (path: string) => void
  description: string
}) {
  if (files.length === 0) return null

  return (
    <div className="file-list checkbox-list">
      <h4>{title}</h4>
      <p className="description">{description}</p>
      <ul>
        {files.map(file => (
          <li key={file.path}>
            <label>
              <input
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

function InputStep({
  projectPath,
  isTauri,
  loading,
  onPathChange,
  onSelectFolder,
  onQuickInit,
  onGetPlan,
}: {
  projectPath: string
  isTauri: boolean
  loading: boolean
  onPathChange: (value: string) => void
  onSelectFolder: () => void
  onQuickInit: () => void
  onGetPlan: () => void
}) {
  return (
    <div className="input-step">
      <p>
        Create a <code>.centy</code> folder to track issues and documentation
        for your project.
      </p>

      <div className="path-input">
        <label htmlFor="project-path">Project Path:</label>
        <div className="input-row">
          <input
            id="project-path"
            type="text"
            value={projectPath}
            onChange={e => onPathChange(e.target.value)}
            placeholder="/path/to/your/project"
          />
          {isTauri && (
            <button
              type="button"
              onClick={onSelectFolder}
              className="browse-btn"
            >
              Browse...
            </button>
          )}
        </div>
      </div>

      <div className="actions">
        <button
          onClick={onQuickInit}
          disabled={!projectPath.trim() || loading}
          className="primary"
        >
          {loading ? 'Initializing...' : 'Quick Init'}
        </button>
        <button
          onClick={onGetPlan}
          disabled={!projectPath.trim() || loading}
          className="secondary"
        >
          {loading ? 'Loading...' : 'Review Changes'}
        </button>
      </div>
    </div>
  )
}

function PlanStep({
  plan,
  projectPath,
  selectedRestore,
  selectedReset,
  loading,
  toggleRestore,
  toggleReset,
  onReset,
  onExecute,
}: {
  plan: ReconciliationPlan
  projectPath: string
  selectedRestore: Set<string>
  selectedReset: Set<string>
  loading: boolean
  toggleRestore: (path: string) => void
  toggleReset: (path: string) => void
  onReset: () => void
  onExecute: () => void
}) {
  return (
    <div className="plan-step">
      <h3>Reconciliation Plan</h3>
      <p>
        Review what will happen when initializing <code>{projectPath}</code>
      </p>

      <FileList files={plan.toCreate} title="Files to Create" />

      <CheckboxList
        files={plan.toRestore}
        title="Files to Restore"
        selected={selectedRestore}
        toggle={toggleRestore}
        description="These files were deleted but exist in the manifest. Select which to restore."
      />

      <CheckboxList
        files={plan.toReset}
        title="Files to Reset"
        selected={selectedReset}
        toggle={toggleReset}
        description="These files were modified. Select which to reset to original."
      />

      <FileList files={plan.upToDate} title="Up to Date" />
      <FileList files={plan.userFiles} title="User Files (unchanged)" />

      <div className="actions">
        <button onClick={onReset} className="secondary">
          Cancel
        </button>
        <button onClick={onExecute} disabled={loading} className="primary">
          {loading ? 'Executing...' : 'Apply Changes'}
        </button>
      </div>
    </div>
  )
}

function SuccessStep({
  result,
  projectPath,
  onReset,
}: {
  result: InitResponse
  projectPath: string
  onReset: () => void
}) {
  return (
    <div className="success-step">
      <h3>Success!</h3>
      <p>
        Centy has been initialized in <code>{projectPath}</code>
      </p>

      {result.created.length > 0 && (
        <div className="result-section">
          <h4>Created:</h4>
          <ul>
            {result.created.map(path => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}

      {result.restored.length > 0 && (
        <div className="result-section">
          <h4>Restored:</h4>
          <ul>
            {result.restored.map(path => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}

      {result.reset.length > 0 && (
        <div className="result-section">
          <h4>Reset:</h4>
          <ul>
            {result.reset.map(path => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onReset} className="primary">
        Initialize Another Project
      </button>
    </div>
  )
}

async function performQuickInit(
  projectPath: string,
  setResult: (result: InitResponse) => void,
  setStep: (step: InitStep) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
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
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
    setStep('error')
  } finally {
    setLoading(false)
  }
}

async function fetchReconciliationPlan(
  projectPath: string,
  setPlan: (plan: ReconciliationPlan) => void,
  setStep: (step: InitStep) => void,
  setSelectedRestore: (selected: Set<string>) => void,
  setSelectedReset: (selected: Set<string>) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
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

    setSelectedRestore(new Set(response.toRestore.map(f => f.path)))
    setSelectedReset(new Set())
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
    setStep('error')
  } finally {
    setLoading(false)
  }
}

async function executeReconciliationPlan(
  projectPath: string,
  selectedRestore: Set<string>,
  selectedReset: Set<string>,
  setResult: (result: InitResponse) => void,
  setStep: (step: InitStep) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) {
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
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
    setStep('error')
  } finally {
    setLoading(false)
  }
}

function toggleSetItem(
  setter: React.Dispatch<React.SetStateAction<Set<string>>>
) {
  return (path: string) => {
    setter(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }
}

async function selectTauriFolder(
  isTauri: boolean,
  setProjectPath: (path: string) => void
) {
  if (!isTauri) return
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Select Project Folder',
    })
    if (selected) {
      setProjectPath(typeof selected === 'string' ? selected : String(selected))
    }
  } catch (err) {
    if (!(err instanceof Error) || err.name !== 'AbortError') {
      console.error('Failed to select folder:', err)
    }
  }
}

function useInitProjectFields() {
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

  return {
    projectPath,
    setProjectPath,
    step,
    setStep,
    plan,
    setPlan,
    result,
    setResult,
    error,
    setError,
    selectedRestore,
    setSelectedRestore,
    selectedReset,
    setSelectedReset,
    loading,
    setLoading,
    isTauri,
  }
}

function useInitProjectState() {
  const f = useInitProjectFields()

  const handleSelectFolder = useCallback(
    () => selectTauriFolder(f.isTauri, f.setProjectPath),
    [f.isTauri] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleQuickInit = useCallback(async () => {
    await performQuickInit(
      f.projectPath,
      f.setResult,
      f.setStep,
      f.setError,
      f.setLoading
    )
  }, [f.projectPath]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetPlan = useCallback(async () => {
    await fetchReconciliationPlan(
      f.projectPath,
      f.setPlan,
      f.setStep,
      f.setSelectedRestore,
      f.setSelectedReset,
      f.setError,
      f.setLoading
    )
  }, [f.projectPath]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleExecutePlan = useCallback(async () => {
    await executeReconciliationPlan(
      f.projectPath,
      f.selectedRestore,
      f.selectedReset,
      f.setResult,
      f.setStep,
      f.setError,
      f.setLoading
    )
  }, [f.projectPath, f.selectedRestore, f.selectedReset]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRestore = useCallback(
    (path: string) => toggleSetItem(f.setSelectedRestore)(path),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const toggleReset = useCallback(
    (path: string) => toggleSetItem(f.setSelectedReset)(path),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleReset = useCallback(() => {
    f.setStep('input')
    f.setPlan(null)
    f.setResult(null)
    f.setError(null)
    f.setSelectedRestore(new Set())
    f.setSelectedReset(new Set())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...f,
    handleSelectFolder,
    handleQuickInit,
    handleGetPlan,
    handleExecutePlan,
    toggleRestore,
    toggleReset,
    handleReset,
  }
}

function InitProjectContent({
  state,
}: {
  state: ReturnType<typeof useInitProjectState>
}) {
  return (
    <>
      {state.step === 'input' && (
        <InputStep
          projectPath={state.projectPath}
          isTauri={state.isTauri}
          loading={state.loading}
          onPathChange={state.setProjectPath}
          onSelectFolder={state.handleSelectFolder}
          onQuickInit={state.handleQuickInit}
          onGetPlan={state.handleGetPlan}
        />
      )}

      {state.step === 'plan' && state.plan && (
        <PlanStep
          plan={state.plan}
          projectPath={state.projectPath}
          selectedRestore={state.selectedRestore}
          selectedReset={state.selectedReset}
          loading={state.loading}
          toggleRestore={state.toggleRestore}
          toggleReset={state.toggleReset}
          onReset={state.handleReset}
          onExecute={state.handleExecutePlan}
        />
      )}

      {state.step === 'executing' && (
        <div className="executing-step">
          <div className="spinner" />
          <p>Initializing project...</p>
        </div>
      )}

      {state.step === 'success' && state.result && (
        <SuccessStep
          result={state.result}
          projectPath={state.projectPath}
          onReset={state.handleReset}
        />
      )}

      {state.step === 'error' && (
        <div className="error-step">
          <h3>Error</h3>
          {state.error && <DaemonErrorMessage error={state.error} />}
          <button onClick={state.handleReset} className="primary">
            Try Again
          </button>
        </div>
      )}
    </>
  )
}

export function InitProject() {
  const state = useInitProjectState()

  return (
    <div className="init-project">
      <h2>Initialize Centy Project</h2>
      <InitProjectContent state={state} />
    </div>
  )
}
