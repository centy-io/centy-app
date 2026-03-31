import type { ReactElement } from 'react'

interface CustomFieldMoveButtonsProps {
  index: number
  totalCount: number
  onMoveUp: () => void
  onMoveDown: () => void
}

export function CustomFieldMoveButtons({
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
}: CustomFieldMoveButtonsProps): ReactElement {
  return (
    <div className="custom-field-move-btns">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="custom-field-move-btn"
        title="Move up"
      >
        &uarr;
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === totalCount - 1}
        className="custom-field-move-btn"
        title="Move down"
      >
        &darr;
      </button>
    </div>
  )
}
