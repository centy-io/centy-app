import { TTL_OPTIONS } from './StandaloneWorkspaceModal.types'

interface WorkspaceFormFieldsProps {
  name: string
  setName: (value: string) => void
  description: string
  setDescription: (value: string) => void
  ttlHours: number
  setTtlHours: (value: number) => void
}

export function WorkspaceFormFields({
  name,
  setName,
  description,
  setDescription,
  ttlHours,
  setTtlHours,
}: WorkspaceFormFieldsProps) {
  return (
    <>
      <div className="standalone-modal-description">
        Create a temporary workspace without associating it with an issue. Great
        for quick experiments or exploratory work.
      </div>

      <div className="standalone-modal-field">
        <label htmlFor="workspace-name">Name (optional)</label>
        <input
          id="workspace-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Experiment with new API"
          className="standalone-modal-input"
        />
      </div>

      <div className="standalone-modal-field">
        <label htmlFor="workspace-description">Description (optional)</label>
        <textarea
          id="workspace-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What would you like to work on in this workspace?"
          className="standalone-modal-textarea"
          rows={3}
        />
      </div>

      <div className="standalone-modal-field">
        <label htmlFor="workspace-ttl">Workspace Duration</label>
        <select
          id="workspace-ttl"
          value={ttlHours}
          onChange={e => setTtlHours(Number(e.target.value))}
          className="standalone-modal-select"
        >
          {TTL_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
