'use client'

import type { ReconciliationPlan } from '@/gen/centy_pb'
import { FileList, CheckboxList } from './FileListComponents'

interface InitPlanStepProps {
  projectPath: string
  plan: ReconciliationPlan
  selectedRestore: Set<string>
  selectedReset: Set<string>
  toggleRestore: (path: string) => void
  toggleReset: (path: string) => void
  loading: boolean
  onReset: () => void
  onExecute: () => void
}

export function InitPlanStep(props: InitPlanStepProps) {
  const { projectPath, plan, loading, onReset, onExecute } = props
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
        selected={props.selectedRestore}
        toggle={props.toggleRestore}
        description="These files were deleted but exist in the manifest. Select which to restore."
      />
      <CheckboxList
        files={plan.toReset}
        title="Files to Reset"
        selected={props.selectedReset}
        toggle={props.toggleReset}
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
