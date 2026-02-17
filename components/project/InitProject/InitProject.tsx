'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { useInitProject } from './useInitProject'
import { FileList, CheckboxList } from './FileListComponents'

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
        <div className="plan-step">
          <h3>Reconciliation Plan</h3>
          <p>
            Review what will happen when initializing{' '}
            <code>{hook.projectPath}</code>
          </p>
          <FileList files={hook.plan.toCreate} title="Files to Create" />
          <CheckboxList
            files={hook.plan.toRestore}
            title="Files to Restore"
            selected={hook.selectedRestore}
            toggle={hook.toggleRestore}
            description="These files were deleted but exist in the manifest. Select which to restore."
          />
          <CheckboxList
            files={hook.plan.toReset}
            title="Files to Reset"
            selected={hook.selectedReset}
            toggle={hook.toggleReset}
            description="These files were modified. Select which to reset to original."
          />
          <FileList files={hook.plan.upToDate} title="Up to Date" />
          <FileList
            files={hook.plan.userFiles}
            title="User Files (unchanged)"
          />
          <div className="actions">
            <button onClick={hook.handleReset} className="secondary">
              Cancel
            </button>
            <button
              onClick={hook.handleExecutePlan}
              disabled={hook.loading}
              className="primary"
            >
              {hook.loading ? 'Executing...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      )}
      {hook.step === 'executing' && (
        <div className="executing-step">
          <div className="spinner" />
          <p>Initializing project...</p>
        </div>
      )}
      {hook.step === 'success' && hook.result && (
        <div className="success-step">
          <h3>Success!</h3>
          <p>
            Centy has been initialized in <code>{hook.projectPath}</code>
          </p>
          {hook.result.created.length > 0 && (
            <div className="result-section">
              <h4>Created:</h4>
              <ul>
                {hook.result.created.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {hook.result.restored.length > 0 && (
            <div className="result-section">
              <h4>Restored:</h4>
              <ul>
                {hook.result.restored.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {hook.result.reset.length > 0 && (
            <div className="result-section">
              <h4>Reset:</h4>
              <ul>
                {hook.result.reset.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={hook.handleReset} className="primary">
            Initialize Another Project
          </button>
        </div>
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
