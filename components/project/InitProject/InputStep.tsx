'use client'

interface InputStepProps {
  projectPath: string
  setProjectPath: (v: string) => void
  isTauri: boolean
  loading: boolean
  handleSelectFolder: () => Promise<void>
  handleQuickInit: () => Promise<void>
  handleGetPlan: () => Promise<void>
}

export function InputStep({
  projectPath,
  setProjectPath,
  isTauri,
  loading,
  handleSelectFolder,
  handleQuickInit,
  handleGetPlan,
}: InputStepProps) {
  return (
    <div className="input-step">
      <p className="input-step-description">
        Create a <code className="inline-code">.centy</code> folder to track issues and documentation
        for your project.
      </p>
      <div className="path-input">
        <label className="form-label" htmlFor="project-path">Project Path:</label>
        <div className="input-row">
          <input
            className="form-input"
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
  )
}
