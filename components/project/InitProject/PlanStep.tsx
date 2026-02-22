/* eslint-disable max-lines */
'use client'

import {
  type FileInfo,
  FileType,
  type ReconciliationPlan,
} from '@/gen/centy_pb'

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

function FileList({ files, title }: { files: FileInfo[]; title: string }) {
  if (files.length === 0) return null
  return (
    <div className="file-list">
      <h4 className="file-list-title">{title}</h4>
      <ul className="file-list-items">
        {files.map(file => (
          <li className="file-list-item" key={file.path}>
            <span className="file-icon">
              {file.fileType === FileType.DIRECTORY
                ? '\uD83D\uDCC1'
                : '\uD83D\uDCC4'}
            </span>
            <span className="file-path">{file.path}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CheckboxList({
  files,
  title,
  selected,
  toggle,
  description,
}: {
  files: FileInfo[]
  title: string
  selected: Set<string>
  toggle: (path: string) => void
  description: string
}) {
  if (files.length === 0) return null
  return (
    <div className="file-list checkbox-list">
      <h4 className="file-list-title">{title}</h4>
      <p className="description">{description}</p>
      <ul className="file-list-items">
        {files.map(file => (
          <li className="file-list-item" key={file.path}>
            <label className="form-label">
              <input
                className="form-checkbox"
                type="checkbox"
                checked={selected.has(file.path)}
                onChange={() => toggle(file.path)}
              />
              <span className="file-icon">
                {file.fileType === FileType.DIRECTORY
                  ? '\uD83D\uDCC1'
                  : '\uD83D\uDCC4'}
              </span>
              <span className="file-path">{file.path}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
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
        Review what will happen when initializing <code className="inline-code">{projectPath}</code>
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
