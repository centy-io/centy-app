import { ProjectCheckboxes } from './ProjectCheckboxes'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'

interface GenericCreateFormFieldsProps {
  config: ItemTypeConfigProto | null
  status: string
  setStatus: (v: string) => void
  customFields: Record<string, string>
  setCustomFields: (v: Record<string, string>) => void
  currentProjectPath: string
  additionalProjects: string[]
  setAdditionalProjects: (v: string[]) => void
}

function toDisplayLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

interface StatusSelectProps {
  statuses: string[]
  status: string
  setStatus: (v: string) => void
}

function StatusSelect({ statuses, status, setStatus }: StatusSelectProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="status">
        Status:
      </label>
      <select
        className="form-input"
        id="status"
        value={status}
        onChange={e => {
          setStatus(e.target.value)
        }}
      >
        {statuses.map(s => (
          <option key={s} value={s} className="form-option">
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}

export function GenericCreateFormFields({
  config,
  status,
  setStatus,
  customFields,
  setCustomFields,
  currentProjectPath,
  additionalProjects,
  setAdditionalProjects,
}: GenericCreateFormFieldsProps) {
  function toggleProject(path: string) {
    if (additionalProjects.includes(path)) {
      setAdditionalProjects(additionalProjects.filter(p => p !== path))
    } else {
      setAdditionalProjects([...additionalProjects, path])
    }
  }

  const showStatus =
    config &&
    config.features &&
    config.features.status &&
    config.statuses.length > 0

  return (
    <>
      {showStatus && (
        <StatusSelect
          statuses={config.statuses}
          status={status}
          setStatus={setStatus}
        />
      )}

      {config &&
        config.customFields.map(field => (
          <div key={field.name} className="form-group">
            <label className="form-label" htmlFor={`field-${field.name}`}>
              {toDisplayLabel(field.name)}
              {field.required ? ' *' : ''}:
            </label>
            <textarea
              className="form-input"
              id={`field-${field.name}`}
              value={customFields[field.name] || ''}
              onChange={e => {
                setCustomFields({
                  ...customFields,
                  [field.name]: e.target.value,
                })
              }}
              placeholder={field.name}
              rows={3}
              required={field.required}
            />
          </div>
        ))}

      <ProjectCheckboxes
        currentProjectPath={currentProjectPath}
        selectedProjects={additionalProjects}
        onToggle={toggleProject}
      />
    </>
  )
}
