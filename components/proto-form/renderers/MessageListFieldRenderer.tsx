'use client'

import { MessageItem } from './MessageItem'
import { useMessageListState } from './useMessageListState'
import type { MessageListFieldProps } from './MessageListFieldProps.types'

export function MessageListFieldRenderer({
  messageDesc,
  label,
  description,
  value,
  onChange,
  ProtoFormRenderer,
}: MessageListFieldProps) {
  const {
    items,
    expanded,
    handleAdd,
    handleRemove,
    handleItemChange,
    toggleExpanded,
  } = useMessageListState(value, onChange, messageDesc)

  return (
    <div className="proto-form-field">
      <label className="proto-form-field-label">{label}</label>
      {description && (
        <p className="proto-form-field-description">{description}</p>
      )}
      <div className="proto-form-message-list">
        {items.map((item, i) => (
          <MessageItem
            key={i}
            item={item}
            index={i}
            messageName={messageDesc.name}
            isExpanded={expanded.has(i)}
            onToggle={toggleExpanded}
            onRemove={handleRemove}
            onItemChange={handleItemChange}
            messageDesc={messageDesc}
            ProtoFormRenderer={ProtoFormRenderer}
          />
        ))}
      </div>
      <button
        type="button"
        className="proto-form-add-btn proto-form-add-message-btn"
        onClick={handleAdd}
      >
        + Add {messageDesc.name}
      </button>
      {items.length === 0 && (
        <p className="proto-form-empty">No {label.toLowerCase()} configured</p>
      )}
    </div>
  )
}
