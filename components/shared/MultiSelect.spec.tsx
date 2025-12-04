import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelect } from './MultiSelect'

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('MultiSelect', () => {
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

  it('should call onChange when option is toggled', () => {
    const onChange = vi.fn()
    render(<MultiSelect options={mockOptions} value={[]} onChange={onChange} />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    const checkboxes = screen.getAllByRole('checkbox')
    // First checkbox is "All", second is "Option 1"
    fireEvent.click(checkboxes[1])

    expect(onChange).toHaveBeenCalledWith(['option1'])
  })

  it('should remove value when toggling already selected option', () => {
    const onChange = vi.fn()
    render(
      <MultiSelect
        options={mockOptions}
        value={['option1', 'option2']}
        onChange={onChange}
      />
    )

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    const checkboxes = screen.getAllByRole('checkbox')
    // Toggle off option1
    fireEvent.click(checkboxes[1])

    expect(onChange).toHaveBeenCalledWith(['option2'])
  })

  it('should select all when clicking All checkbox', () => {
    const onChange = vi.fn()
    render(<MultiSelect options={mockOptions} value={[]} onChange={onChange} />)

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    const allCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(allCheckbox)

    expect(onChange).toHaveBeenCalledWith(['option1', 'option2', 'option3'])
  })

  it('should deselect all when clicking All checkbox while all selected', () => {
    const onChange = vi.fn()
    render(
      <MultiSelect
        options={mockOptions}
        value={['option1', 'option2', 'option3']}
        onChange={onChange}
      />
    )

    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)

    const allCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(allCheckbox)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('should apply custom className', () => {
    render(
      <MultiSelect
        options={mockOptions}
        value={[]}
        onChange={() => {}}
        className="custom-class"
      />
    )

    const container = document.querySelector('.multi-select')
    expect(container).toHaveClass('custom-class')
  })
})
