/* eslint-disable max-lines, max-lines-per-function */
'use client'

import { useState } from 'react'
import { create } from '@bufbuild/protobuf'
import type { DescMessage } from '@bufbuild/protobuf'
import { MessageItem } from './MessageItem'
import type { FieldRenderProps } from '@/lib/proto-form/FieldRenderProps'

interface MessageListFieldProps extends Omit<FieldRenderProps, 'field'> {
  messageDesc: DescMessage
  ProtoFormRenderer: React.ComponentType<{
    schema: DescMessage
    value: Record<string, unknown>
    onChange: (updates: Record<string, unknown>) => void
  }>
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

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    setExpanded(prev => {
      const next = new Set<number>()
      for (const idx of prev) {
        if (idx < index) next.add(idx)
        else if (idx > index) next.add(idx - 1)
      }
      return next
    })
  }

  const handleItemChange = (
    index: number,
    updates: Record<string, unknown>
  ) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    )
  }

  const toggleExpanded = (index: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
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
