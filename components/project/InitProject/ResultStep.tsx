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
      <h3>Error</h3>
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
      <p>Initializing project...</p>
    </div>
  )
}
