import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelect } from '.'

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('MultiSelect - Display', () => {
  it('should render with placeholder when no values selected', () => {
    render(
      <MultiSelect
        options={mockOptions}
        value={[]}
        onChange={() => {}}
        placeholder="Select..."
      />
    )

    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('should display single selected value label', () => {
    render(
      <MultiSelect
        options={mockOptions}
        value={['option1']}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('should display count when multiple values selected', () => {
    render(
      <MultiSelect
        options={mockOptions}
        value={['option1', 'option2']}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('should display All when all options selected', () => {
    render(
      <MultiSelect
        options={mockOptions}
        value={['option1', 'option2', 'option3']}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('should open dropdown on click', () => {
    render(<MultiSelect options={mockOptions} value={[]} onChange={() => {}} />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })
})
