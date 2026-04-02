'use client'

import { useState } from 'react'
import { create, type DescMessage } from '@bufbuild/protobuf'
import { MessageItem } from './MessageItem'
import type {
  FieldRenderProps,
  ProtoFormRendererType,
} from '@/lib/proto-form/types'

interface MessageListFieldProps extends Omit<FieldRenderProps, 'field'> {
  messageDesc: DescMessage
  ProtoFormRenderer: ProtoFormRendererType
}

function toRecordArray(v: unknown): Record<string, unknown>[] {
  if (Array.isArray(v)) {
    return v.filter(
      item =>
        item !== null &&
        item !== undefined &&
        typeof item === 'object' &&
        !Array.isArray(item)
    )
  }
  return []
}

function shiftExpandedAfterRemove(
  prev: Set<number>,
  index: number
): Set<number> {
  const next = new Set<number>()
  for (const idx of prev) {
    if (idx < index) next.add(idx)
    else if (idx > index) next.add(idx - 1)
  }
  return next
}
function toggleIndex(prev: Set<number>, index: number): Set<number> {
  const next = new Set(prev)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  return next
}

export function MessageListFieldRenderer({
  messageDesc,
  label,
  description,
  value,
  onChange,
  ProtoFormRenderer,
}: MessageListFieldProps) {
  const items = toRecordArray(value)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const handleAdd = () => {
    const newItem: Record<string, unknown> = {}
    Object.assign(newItem, create(messageDesc))
    const next = [...items, newItem]
    onChange(next)
    setExpanded(prev => new Set([...prev, next.length - 1]))
  }

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
            onToggle={index => setExpanded(prev => toggleIndex(prev, index))}
            onRemove={index => {
              onChange(items.filter((_, j) => j !== index))
              setExpanded(prev => shiftExpandedAfterRemove(prev, index))
            }}
            onItemChange={(idx, upd) =>
              onChange(
                items.map((it, j) => (j === idx ? { ...it, ...upd } : it))
              )
            }
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
