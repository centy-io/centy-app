import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelect } from '.'

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('MultiSelect - Interactions', () => {
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
        onChange={vi.fn()}
        className="custom-class"
      />
    )

    const container = document.querySelector('.multi-select')
    expect(container).toHaveClass('custom-class')
  })
})
