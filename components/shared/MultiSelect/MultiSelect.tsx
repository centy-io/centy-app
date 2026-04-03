'use client'

import type { MultiSelectProps } from './MultiSelect.types'
import { useMultiSelect } from './useMultiSelect'
import { MultiSelectDropdown } from './MultiSelectDropdown'

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const resolvedPlaceholder = placeholder ?? 'Select...'
  const resolvedClassName = className ?? ''
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
        <MultiSelectDropdown
          options={options}
          value={value}
          floatingRef={refs.setFloating}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          allSelected={allSelected}
          handleSelectAll={handleSelectAll}
          handleOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  )
}
