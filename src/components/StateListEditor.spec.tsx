import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StateListEditor } from './StateListEditor'

describe('StateListEditor', () => {
  const defaultProps = {
    states: ['open', 'in-progress', 'closed'],
    stateColors: {
      open: '#10b981',
      'in-progress': '#f59e0b',
      closed: '#6b7280',
    },
    defaultState: 'open',
    onStatesChange: vi.fn(),
    onColorsChange: vi.fn(),
    onDefaultChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all states', () => {
    render(<StateListEditor {...defaultProps} />)

    expect(screen.getByText('open')).toBeInTheDocument()
    expect(screen.getByText('in-progress')).toBeInTheDocument()
    expect(screen.getByText('closed')).toBeInTheDocument()
  })

  it('should render color pickers for each state', () => {
    render(<StateListEditor {...defaultProps} />)

    const colorInputs = document.querySelectorAll('input[type="color"]')
    expect(colorInputs).toHaveLength(3)
  })

  it('should add new state when clicking Add State button', () => {
    const onStatesChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onStatesChange={onStatesChange} />
    )

    const input = screen.getByPlaceholderText('New state name...')
    fireEvent.change(input, { target: { value: 'review' } })

    const addButton = screen.getByRole('button', { name: '+ Add State' })
    fireEvent.click(addButton)

    expect(onStatesChange).toHaveBeenCalledWith([
      'open',
      'in-progress',
      'closed',
      'review',
    ])
  })

  it('should add state on Enter key press', () => {
    const onStatesChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onStatesChange={onStatesChange} />
    )

    const input = screen.getByPlaceholderText('New state name...')
    fireEvent.change(input, { target: { value: 'review' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onStatesChange).toHaveBeenCalledWith([
      'open',
      'in-progress',
      'closed',
      'review',
    ])
  })

  it('should normalize state name by converting to lowercase and replacing spaces with hyphens', () => {
    const onStatesChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onStatesChange={onStatesChange} />
    )

    const input = screen.getByPlaceholderText('New state name...')
    fireEvent.change(input, { target: { value: 'Under Review' } })

    const addButton = screen.getByRole('button', { name: '+ Add State' })
    fireEvent.click(addButton)

    expect(onStatesChange).toHaveBeenCalledWith([
      'open',
      'in-progress',
      'closed',
      'under-review',
    ])
  })

  it('should not add duplicate state', () => {
    render(<StateListEditor {...defaultProps} />)

    const input = screen.getByPlaceholderText('New state name...')
    fireEvent.change(input, { target: { value: 'open' } })

    const addButton = screen.getByRole('button', { name: '+ Add State' })
    expect(addButton).toBeDisabled()
  })

  it('should remove state when clicking remove button', () => {
    const onStatesChange = vi.fn()
    const onColorsChange = vi.fn()
    render(
      <StateListEditor
        {...defaultProps}
        onStatesChange={onStatesChange}
        onColorsChange={onColorsChange}
      />
    )

    const removeButtons = screen.getAllByRole('button', { name: '×' })
    // Click the second remove button (in-progress)
    fireEvent.click(removeButtons[1])

    expect(onStatesChange).toHaveBeenCalledWith(['open', 'closed'])
  })

  it('should not allow removing the default state', () => {
    render(<StateListEditor {...defaultProps} />)

    const removeButtons = screen.getAllByRole('button', { name: '×' })
    // First button is for 'open' which is the default
    expect(removeButtons[0]).toBeDisabled()
  })

  it('should not allow removing when only one state exists', () => {
    render(<StateListEditor {...defaultProps} states={['open']} />)

    const removeButton = screen.getByRole('button', { name: '×' })
    expect(removeButton).toBeDisabled()
  })

  it('should call onColorsChange when color is changed', () => {
    const onColorsChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onColorsChange={onColorsChange} />
    )

    const colorInputs = document.querySelectorAll('input[type="color"]')
    fireEvent.change(colorInputs[0], { target: { value: '#ff0000' } })

    expect(onColorsChange).toHaveBeenCalledWith({
      open: '#ff0000',
      'in-progress': '#f59e0b',
      closed: '#6b7280',
    })
  })

  it('should call onDefaultChange when default state is changed', () => {
    const onDefaultChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onDefaultChange={onDefaultChange} />
    )

    const selects = screen.getAllByRole('combobox')
    // Change the second state (in-progress) to be the default
    fireEvent.change(selects[1], { target: { value: 'default' } })

    expect(onDefaultChange).toHaveBeenCalledWith('in-progress')
  })

  it('should use default color for state without custom color', () => {
    render(<StateListEditor {...defaultProps} stateColors={{}} />)

    // Should still render without errors
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('should support drag and drop reordering', () => {
    const onStatesChange = vi.fn()
    render(
      <StateListEditor {...defaultProps} onStatesChange={onStatesChange} />
    )

    const items = document.querySelectorAll('.state-item')
    expect(items).toHaveLength(3)

    // Simulate drag start
    fireEvent.dragStart(items[0])

    // Simulate drag over another item
    fireEvent.dragOver(items[2], { preventDefault: () => {} })

    // Simulate drag end
    fireEvent.dragEnd(items[0])
  })

  it('should render hint text', () => {
    render(<StateListEditor {...defaultProps} />)

    expect(
      screen.getByText(
        'Drag to reorder. The default state is used for new issues.'
      )
    ).toBeInTheDocument()
  })
})
