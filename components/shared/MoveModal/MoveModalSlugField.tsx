import type { MoveModalProps } from './MoveModal.types'
import type { useMoveModal } from './useMoveModal'

interface MoveModalSlugFieldProps {
  props: MoveModalProps
  state: ReturnType<typeof useMoveModal>
}

export function MoveModalSlugField({ props, state }: MoveModalSlugFieldProps) {
  if (props.entityType !== 'doc') return null
  return (
    <div className="move-modal-field">
      <label className="move-modal-label">
        New Slug (optional - leave empty to keep current)
      </label>
      <input
        type="text"
        value={state.newSlug}
        onChange={e => state.setNewSlug(e.target.value)}
        placeholder={props.entityId}
        className="move-modal-input"
      />
      <span className="move-modal-hint">
        Change if the slug already exists in the target project
      </span>
    </div>
  )
}
