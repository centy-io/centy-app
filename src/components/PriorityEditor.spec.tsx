import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PriorityEditor } from './PriorityEditor'

describe('PriorityEditor', () => {
  const defaultProps = {
    levels: 3,
    colors: { '1': '#ef4444', '2': '#f59e0b', '3': '#10b981' },
    onLevelsChange: vi.fn(),
    onColorsChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<PriorityEditor {...defaultProps} />)

    expect(screen.getByText('Number of priority levels:')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('3')
  })

  it('should render priority items for each level', () => {
    render(<PriorityEditor {...defaultProps} />)

    expect(screen.getByText('Priority 1')).toBeInTheDocument()
    expect(screen.getByText('Priority 2')).toBeInTheDocument()
    expect(screen.getByText('Priority 3')).toBeInTheDocument()
  })

  it('should display High/Medium/Low labels for 3 levels', () => {
    render(<PriorityEditor {...defaultProps} />)

    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('should display Critical/High/Medium/Low labels for 4 levels', () => {
    render(<PriorityEditor {...defaultProps} levels={4} />)

    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('should display P1/P2/etc labels for more than 4 levels', () => {
    render(<PriorityEditor {...defaultProps} levels={5} />)

    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText('P2')).toBeInTheDocument()
    expect(screen.getByText('P3')).toBeInTheDocument()
    expect(screen.getByText('P4')).toBeInTheDocument()
    expect(screen.getByText('P5')).toBeInTheDocument()
  })

  it('should call onLevelsChange when number of levels is changed', () => {
    const onLevelsChange = vi.fn()
    const onColorsChange = vi.fn()
    render(
      <PriorityEditor
        {...defaultProps}
        onLevelsChange={onLevelsChange}
        onColorsChange={onColorsChange}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '5' } })

    expect(onLevelsChange).toHaveBeenCalledWith(5)
  })

  it('should clean up colors when levels are reduced', () => {
    const onLevelsChange = vi.fn()
    const onColorsChange = vi.fn()
    render(
      <PriorityEditor
        {...defaultProps}
        levels={5}
        colors={{
          '1': '#ff0000',
          '2': '#00ff00',
          '3': '#0000ff',
          '4': '#ffff00',
          '5': '#ff00ff',
        }}
        onLevelsChange={onLevelsChange}
        onColorsChange={onColorsChange}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '2' } })

    expect(onColorsChange).toHaveBeenCalledWith({
      '1': '#ff0000',
      '2': '#00ff00',
    })
  })

  it('should call onColorsChange when a color is changed', () => {
    const onColorsChange = vi.fn()
    render(<PriorityEditor {...defaultProps} onColorsChange={onColorsChange} />)

    const colorInputs = document.querySelectorAll('input[type="color"]')
    fireEvent.change(colorInputs[0], { target: { value: '#ff0000' } })

    expect(onColorsChange).toHaveBeenCalledWith({
      '1': '#ff0000',
      '2': '#f59e0b',
      '3': '#10b981',
    })
  })

  it('should use default colors when colors prop is empty', () => {
    render(<PriorityEditor {...defaultProps} colors={{}} />)

    // Should render without errors
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('should render hint text', () => {
    render(<PriorityEditor {...defaultProps} />)

    expect(
      screen.getByText(
        'Priority 1 is the highest priority. Labels are shown based on the number of levels.'
      )
    ).toBeInTheDocument()
  })

  it('should render all level options in select', () => {
    render(<PriorityEditor {...defaultProps} />)

    const select = screen.getByRole('combobox')
    expect(select.querySelectorAll('option')).toHaveLength(10)
  })

  it('should show correct option text for singular and plural levels', () => {
    render(<PriorityEditor {...defaultProps} />)

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('1 level')
    expect(options[1]).toHaveTextContent('2 levels')
  })

  it('should render color pickers for each priority level', () => {
    render(<PriorityEditor {...defaultProps} />)

    const colorInputs = document.querySelectorAll('input[type="color"]')
    expect(colorInputs).toHaveLength(3)
  })

  it('should apply correct background color to priority preview', () => {
    render(<PriorityEditor {...defaultProps} />)

    const previews = document.querySelectorAll('.priority-preview')
    expect(previews[0]).toHaveStyle({ backgroundColor: '#ef4444' })
    expect(previews[1]).toHaveStyle({ backgroundColor: '#f59e0b' })
    expect(previews[2]).toHaveStyle({ backgroundColor: '#10b981' })
  })
})
