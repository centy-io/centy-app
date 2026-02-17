'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useInitProject } from './useInitProject'
import { InitPlanStep } from './InitPlanStep'
import { InitSuccessStep } from './InitSuccessStep'

export function InitProject() {
  const hook = useInitProject()

  return (
    <div className="init-project">
      <h2>Initialize Centy Project</h2>
      {hook.step === 'input' && (
        <div className="input-step">
          <p>
            Create a <code>.centy</code> folder to track issues and
            documentation for your project.
          </p>
          <div className="path-input">
            <label htmlFor="project-path">Project Path:</label>
            <div className="input-row">
              <input
                id="project-path"
                type="text"
                value={hook.projectPath}
                onChange={e => hook.setProjectPath(e.target.value)}
                placeholder="/path/to/your/project"
              />
              {hook.isTauri && (
                <button
                  type="button"
                  onClick={hook.handleSelectFolder}
                  className="browse-btn"
                >
                  Browse...
                </button>
              )}
            </div>
          </div>
          <div className="actions">
            <button
              onClick={hook.handleQuickInit}
              disabled={!hook.projectPath.trim() || hook.loading}
              className="primary"
            >
              {hook.loading ? 'Initializing...' : 'Quick Init'}
            </button>
            <button
              onClick={hook.handleGetPlan}
              disabled={!hook.projectPath.trim() || hook.loading}
              className="secondary"
            >
              {hook.loading ? 'Loading...' : 'Review Changes'}
            </button>
          </div>
        </div>
      )}
      {hook.step === 'plan' && hook.plan && (
        <InitPlanStep
          projectPath={hook.projectPath}
          plan={hook.plan}
          selectedRestore={hook.selectedRestore}
          selectedReset={hook.selectedReset}
          toggleRestore={hook.toggleRestore}
          toggleReset={hook.toggleReset}
          loading={hook.loading}
          onReset={hook.handleReset}
          onExecute={hook.handleExecutePlan}
        />
      )}
      {hook.step === 'executing' && (
        <div className="executing-step">
          <div className="spinner" />
          <p>Initializing project...</p>
        </div>
      )}
      {hook.step === 'success' && hook.result && (
        <InitSuccessStep
          projectPath={hook.projectPath}
          result={hook.result}
          onReset={hook.handleReset}
        />
      )}
      {hook.step === 'error' && (
        <div className="error-step">
          <h3>Error</h3>
          {hook.error && <DaemonErrorMessage error={hook.error} />}
          <button onClick={hook.handleReset} className="primary">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
