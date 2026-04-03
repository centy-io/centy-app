import { TtlSelect } from './TtlSelect'
import { EditorPicker } from './EditorPicker'

interface WorkspaceFormBodyProps {
  name: string
  setName: (v: string) => void
  description: string
  setDescription: (v: string) => void
  ttlHours: number
  setTtlHours: (v: number) => void
  selectedEditor: string
  setSelectedEditor: (v: string) => void
  isEditorAvailable: (id: string) => boolean
}

export function WorkspaceFormBody({
  name,
  setName,
  description,
  setDescription,
  ttlHours,
  setTtlHours,
  selectedEditor,
  setSelectedEditor,
  isEditorAvailable,
}: WorkspaceFormBodyProps) {
  return (
    <>
      <div className="standalone-modal-description">
        Create a temporary workspace without associating it with an issue. Great
        for quick experiments or exploratory work.
      </div>
      <div className="standalone-modal-field">
        <label className="standalone-modal-label" htmlFor="workspace-name">
          Name (optional)
        </label>
        <input
          id="workspace-name"
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
          placeholder="e.g., Experiment with new API"
          className="standalone-modal-input"
        />
      </div>
      <div className="standalone-modal-field">
        <label
          className="standalone-modal-label"
          htmlFor="workspace-description"
        >
          Description (optional)
        </label>
        <textarea
          id="workspace-description"
          value={description}
          onChange={e => {
            setDescription(e.target.value)
          }}
          placeholder="What would you like to work on in this workspace?"
          className="standalone-modal-textarea"
          rows={3}
        />
      </div>
      <TtlSelect ttlHours={ttlHours} setTtlHours={setTtlHours} />
      <EditorPicker
        selectedEditor={selectedEditor}
        setSelectedEditor={setSelectedEditor}
        isEditorAvailable={isEditorAvailable}
      />
    </>
  )
}
