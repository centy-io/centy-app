import { useState, useEffect, useCallback } from 'react'
import {
  useFloating,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
} from '@floating-ui/react'
import type { MultiSelectOption } from './MultiSelect.types'

export function useMultiSelect(
  options: MultiSelectOption[],
  value: string[],
  onChange: (values: string[]) => void
) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    placement: 'bottom-start',
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ])

  const handleOptionToggle = useCallback(
    (optionValue: string) => {
      const newValues = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue]
      onChange(newValues)
    },
    [value, onChange]
  )

  const handleSelectAll = useCallback(() => {
    if (value.length === options.length) {
      onChange([])
    } else {
      onChange(options.map(o => o.value))
    }
  }, [value.length, options, onChange])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const getDisplayText = (placeholder: string) => {
    if (value.length === 0) {
      return placeholder
    }
    if (value.length === options.length) {
      return 'All'
    }
    if (value.length === 1) {
      const found = options.find(o => o.value === value[0])
      return (found ? found.label : '') || value[0]
    }
    return `${value.length} selected`
  }

  const allSelected = value.length === options.length

  return {
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    handleOptionToggle,
    handleSelectAll,
    getDisplayText,
    allSelected,
  }
}
