'use client'

import { FloatingPortal } from '@floating-ui/react'
import type { MultiSelectProps, MultiSelectOption } from './MultiSelect.types'
import { useMultiSelect } from './useMultiSelect'

type MultiSelectState = ReturnType<typeof useMultiSelect>

function MultiSelectDropdown({
  state,
  options,
  value,
}: {
  state: MultiSelectState
  options: MultiSelectOption[]
  value: string[]
}) {
  return (
    <FloatingPortal>
      <div
        ref={state.refs.setFloating}
        style={state.floatingStyles}
        className="multi-select-dropdown"
        {...state.getFloatingProps()}
      >
        <label className="multi-select-option select-all">
          <input
            className="multi-select-checkbox"
            type="checkbox"
            checked={state.allSelected}
            onChange={state.handleSelectAll}
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
              onChange={() => state.handleOptionToggle(option.value)}
            />
            <span className="multi-select-option-label">{option.label}</span>
          </label>
        ))}
      </div>
    </FloatingPortal>
  )
}

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
  const state = useMultiSelect(options, value, onChange)

  return (
    <div className={`multi-select ${resolvedClassName}`}>
      <button
        ref={state.refs.setReference}
        type="button"
        className={`multi-select-trigger ${state.isOpen ? 'open' : ''} ${value.length > 0 ? 'has-value' : ''}`}
        {...state.getReferenceProps()}
      >
        <span className="multi-select-text">
          {state.getDisplayText(resolvedPlaceholder)}
        </span>
        <span className="multi-select-arrow">
          {state.isOpen ? '\u25B2' : '\u25BC'}
        </span>
      </button>
      {state.isOpen && (
        <MultiSelectDropdown state={state} options={options} value={value} />
      )}
    </div>
  )
}
