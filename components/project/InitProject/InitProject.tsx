'use client'

import { useInitProject } from './useInitProject'
import { InputStep } from './InputStep'
import { PlanStep } from './PlanStep'
import { SuccessStep, ErrorStep, ExecutingStep } from './ResultStep'

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
          handleGetPlan={state.handleGetPlan}
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
          handleReset={state.handleReset}
          handleExecutePlan={state.handleExecutePlan}
        />
      )}
      {state.step === 'executing' && <ExecutingStep />}
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
