'use client'

import { FileList } from './FileList'
import { CheckboxList } from './CheckboxList'
import type { ReconciliationPlan } from '@/gen/centy_pb'

interface PlanStepProps {
  plan: ReconciliationPlan
  projectPath: string
  selectedRestore: Set<string>
  selectedReset: Set<string>
  loading: boolean
  toggleRestore: (path: string) => void
  toggleReset: (path: string) => void
  handleReset: () => void
  handleExecutePlan: () => Promise<void>
}

export function PlanStep({
  plan,
  projectPath,
  selectedRestore,
  selectedReset,
  loading,
  toggleRestore,
  toggleReset,
  handleReset,
  handleExecutePlan,
}: PlanStepProps) {
  return (
    <div className="plan-step">
      <h3 className="plan-step-title">Reconciliation Plan</h3>
      <p className="plan-step-description">
        Review what will happen when initializing{' '}
        <code className="inline-code">{projectPath}</code>
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
  )
}
