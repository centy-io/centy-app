'use client'

import { FloatingPortal } from '@floating-ui/react'
import type { MultiSelectProps } from './MultiSelect.types'
import { useMultiSelect } from './useMultiSelect'

// eslint-disable-next-line max-lines-per-function
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const resolvedPlaceholder =
    placeholder !== undefined ? placeholder : 'Select...'
  const resolvedClassName = className !== undefined ? className : ''
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

  return (
    <div className={`multi-select ${resolvedClassName}`}>
      <button
        ref={refs.setReference}
        type="button"
        className={`multi-select-trigger ${isOpen ? 'open' : ''} ${value.length > 0 ? 'has-value' : ''}`}
        {...getReferenceProps()}
      >
        <span className="multi-select-text">
          {getDisplayText(resolvedPlaceholder)}
        </span>
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
                className="multi-select-checkbox"
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <span className="multi-select-option-label">All</span>
            </label>
            <div className="multi-select-divider" />
            {options.map(option => (
              <label key={option.value} className="multi-select-option">
                <input
                  className="multi-select-checkbox"
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleOptionToggle(option.value)}
                />
                <span className="multi-select-option-label">{option.label}</span>
              </label>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}
