'use client'

import type { DescMessage } from '@bufbuild/protobuf'

interface MessageItemProps {
  item: Record<string, unknown>
  index: number
  messageName: string
  isExpanded: boolean
  onToggle: (i: number) => void
  onRemove: (i: number) => void
  onItemChange: (i: number, updates: Record<string, unknown>) => void
  messageDesc: DescMessage
  ProtoFormRenderer: React.ComponentType<{
    schema: DescMessage
    value: Record<string, unknown>
    onChange: (updates: Record<string, unknown>) => void
  }>
}

export function MessageItem({
  item, index, messageName, isExpanded,
  onToggle, onRemove, onItemChange, messageDesc, ProtoFormRenderer,
}: MessageItemProps) {
  return (
    <div className="proto-form-message-item">
      <div className="proto-form-message-item-header">
        <button
          type="button"
          className="proto-form-message-item-toggle"
          onClick={() => onToggle(index)}
        >
          <span className="proto-form-message-item-arrow">
            {isExpanded ? '▾' : '▸'}
          </span>
          {`${messageName} ${index + 1}`}
        </button>
        <button
          type="button"
          className="proto-form-remove-btn"
          onClick={() => onRemove(index)}
          aria-label={`Remove item ${index + 1}`}
        >
          ×
        </button>
      </div>
      {isExpanded && (
        <div className="proto-form-message-item-body">
          <ProtoFormRenderer
            schema={messageDesc}
            value={item}
            onChange={updates => onItemChange(index, updates)}
          />
        </div>
      )}
    </div>
  )
}
