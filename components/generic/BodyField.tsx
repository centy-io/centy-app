interface BodyFieldProps {
  editBody: string
  setEditBody: (v: string) => void
}

export function BodyField({
  editBody,
  setEditBody,
}: BodyFieldProps): React.JSX.Element {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="edit-body">
        Body:
      </label>
      <textarea
        className="form-input"
        id="edit-body"
        rows={6}
        value={editBody}
        onChange={e => {
          setEditBody(e.target.value)
        }}
      />
    </div>
  )
}
