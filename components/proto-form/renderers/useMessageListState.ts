import { useState } from 'react'
import { create } from '@bufbuild/protobuf'
import type { DescMessage } from '@bufbuild/protobuf'

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

export function useMessageListState(
  value: unknown,
  onChange: (v: unknown) => void,
  messageDesc: DescMessage
) {
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
    setExpanded(
      prev =>
        new Set(
          Array.from(prev)
            .filter(i => i !== index)
            .map(i => (i > index ? i - 1 : i))
        )
    )
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

  return {
    items,
    expanded,
    handleAdd,
    handleRemove,
    handleItemChange,
    toggleExpanded,
  }
}
