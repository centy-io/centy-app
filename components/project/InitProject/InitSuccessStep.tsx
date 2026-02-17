'use client'

import type { InitResponse } from '@/gen/centy_pb'

interface InitSuccessStepProps {
  projectPath: string
  result: InitResponse
  onReset: () => void
}

export function InitSuccessStep(props: InitSuccessStepProps) {
  const { projectPath, result, onReset } = props
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
            {result.created.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {result.restored.length > 0 && (
        <div className="result-section">
          <h4>Restored:</h4>
          <ul>
            {result.restored.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {result.reset.length > 0 && (
        <div className="result-section">
          <h4>Reset:</h4>
          <ul>
            {result.reset.map(p => (
              <li key={p}>{p}</li>
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
