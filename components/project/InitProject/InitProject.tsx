'use client'

import { useInitProject } from './useInitProject'
import { InputStep } from './InputStep'
import { SuccessStep, ErrorStep } from './ResultStep'

export function InitProject() {
  const state = useInitProject()

  return (
    <div className="init-project">
      <h2 className="init-project-title">Initialize Centy Project</h2>
      {state.step === 'input' && (
        <InputStep
          projectPath={state.projectPath}
          setProjectPath={state.setProjectPath}
          isTauri={state.isTauri}
          loading={state.loading}
          handleSelectFolder={state.handleSelectFolder}
          handleQuickInit={state.handleQuickInit}
        />
      )}
      {state.step === 'success' && state.result && (
        <SuccessStep
          result={state.result}
          projectPath={state.projectPath}
          handleReset={state.handleReset}
        />
      )}
      {state.step === 'error' && (
        <ErrorStep error={state.error} handleReset={state.handleReset} />
      )}
    </div>
  )
}
