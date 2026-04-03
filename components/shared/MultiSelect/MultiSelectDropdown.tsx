'use client'

import { FloatingPortal } from '@floating-ui/react'
import type { MultiSelectOption } from './MultiSelect.types'

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  value: string[]
  floatingRef: (node: HTMLElement | null) => void
  floatingStyles: React.CSSProperties
  getFloatingProps: () => React.HTMLAttributes<HTMLElement>
  allSelected: boolean
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleOptionToggle: (value: string) => void
}

export function MultiSelectDropdown({
  options,
  value,
  floatingRef,
  floatingStyles,
  getFloatingProps,
  allSelected,
  handleSelectAll,
  handleOptionToggle,
}: MultiSelectDropdownProps) {
  return (
    <FloatingPortal>
      <div
        ref={floatingRef}
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
              onChange={() => {
                handleOptionToggle(option.value)
              }}
            />
            <span className="multi-select-option-label">{option.label}</span>
          </label>
        ))}
      </div>
    </FloatingPortal>
  )
}
