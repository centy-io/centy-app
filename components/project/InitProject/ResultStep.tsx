'use client'

import type { InitResponse } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface SuccessStepProps {
  result: InitResponse
  projectPath: string
  handleReset: () => void
}

export function SuccessStep({
  result,
  projectPath,
  handleReset,
}: SuccessStepProps) {
  return (
    <div className="success-step">
      <h3 className="result-step-title">Success!</h3>
      <p className="result-step-description">
        Centy has been initialized in <code className="inline-code">{projectPath}</code>
      </p>
      {result.created.length > 0 && (
        <div className="result-section">
          <h4 className="result-section-title">Created:</h4>
          <ul className="result-list">
            {result.created.map(path => (
              <li className="result-list-item" key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}
      {result.restored.length > 0 && (
        <div className="result-section">
          <h4 className="result-section-title">Restored:</h4>
          <ul className="result-list">
            {result.restored.map(path => (
              <li className="result-list-item" key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}
      {result.reset.length > 0 && (
        <div className="result-section">
          <h4 className="result-section-title">Reset:</h4>
          <ul className="result-list">
            {result.reset.map(path => (
              <li className="result-list-item" key={path}>{path}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleReset} className="primary">
        Initialize Another Project
      </button>
    </div>
  )
}

interface ErrorStepProps {
  error: string | null
  handleReset: () => void
}

export function ErrorStep({ error, handleReset }: ErrorStepProps) {
  return (
    <div className="error-step">
      <h3 className="result-step-title">Error</h3>
      {error && <DaemonErrorMessage error={error} />}
      <button onClick={handleReset} className="primary">
        Try Again
      </button>
    </div>
  )
}

export function ExecutingStep() {
  return (
    <div className="executing-step">
      <div className="spinner" />
      <p className="executing-step-text">Initializing project...</p>
    </div>
  )
}
