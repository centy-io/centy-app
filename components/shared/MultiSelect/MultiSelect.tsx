'use client'

import { FloatingPortal } from '@floating-ui/react'
import type { MultiSelectProps } from './MultiSelect.types'
import { useMultiSelect } from './useMultiSelect'

export type { MultiSelectOption, MultiSelectProps } from './MultiSelect.types'

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: MultiSelectProps) {
  const {
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    handleOptionToggle,
    handleSelectAll,
    getDisplayText,
    allSelected,
  } = useMultiSelect(options, value, onChange)

  const displayText = getDisplayText() || placeholder

  return (
    <div className={`multi-select ${className}`}>
      <button
        ref={refs.setReference}
        type="button"
        className={`multi-select-trigger ${isOpen ? 'open' : ''} ${value.length > 0 ? 'has-value' : ''}`}
        {...getReferenceProps()}
      >
        <span className="multi-select-text">{displayText}</span>
        <span className="multi-select-arrow">
          {isOpen ? '\u25B2' : '\u25BC'}
        </span>
      </button>

      {isOpen && (
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
      )}
    </div>
  )
}
