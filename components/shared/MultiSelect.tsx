'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  useFloating,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

function MultiSelectDropdown({
  refs,
  floatingStyles,
  getFloatingProps,
  allSelected,
  handleSelectAll,
  options,
  value,
  handleOptionToggle,
}: {
  refs: { setFloating: (node: HTMLElement | null) => void }
  floatingStyles: React.CSSProperties
  getFloatingProps: () => Record<string, unknown>
  allSelected: boolean
  handleSelectAll: () => void
  options: MultiSelectOption[]
  value: string[]
  handleOptionToggle: (optionValue: string) => void
}) {
  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="multi-select-dropdown"
        {...getFloatingProps()}
      >
        <label className="multi-select-option select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span>All</span>
        </label>
        <div className="multi-select-divider" />
        {options.map(option => (
          <label key={option.value} className="multi-select-option">
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleOptionToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </FloatingPortal>
  )
}

function getDisplayText(
  value: string[],
  options: MultiSelectOption[],
  placeholder: string
) {
  if (value.length === 0) return placeholder
  if (value.length === options.length) return 'All'
  if (value.length === 1) {
    const found = options.find(o => o.value === value[0])
    return (found ? found.label : '') || value[0]
  }
  return `${value.length} selected`
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: MultiSelectProps) {
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
    onChange(value.length === options.length ? [] : options.map(o => o.value))
  }, [value.length, options, onChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className={`multi-select ${className}`}>
      <button
        ref={refs.setReference}
        type="button"
        className={`multi-select-trigger ${isOpen ? 'open' : ''} ${value.length > 0 ? 'has-value' : ''}`}
        {...getReferenceProps()}
      >
        <span className="multi-select-text">
          {getDisplayText(value, options, placeholder)}
        </span>
        <span className="multi-select-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <MultiSelectDropdown
          refs={refs}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          allSelected={value.length === options.length}
          handleSelectAll={handleSelectAll}
          options={options}
          value={value}
          handleOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  )
}
