import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DefaultsEditor } from './DefaultsEditor'

describe('DefaultsEditor', () => {
  const defaultProps = {
    value: { title: 'Default Title', state: 'open' },
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state when no values', () => {
    render(<DefaultsEditor value={{}} onChange={() => {}} />)

    expect(screen.getByText('No default values configured')).toBeInTheDocument()
  })

  it('should render all entries', () => {
    render(<DefaultsEditor {...defaultProps} />)

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('state')).toBeInTheDocument()
  })

  it('should render table headers', () => {
    render(<DefaultsEditor {...defaultProps} />)

    expect(screen.getByText('Key')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('should render value inputs with correct values', () => {
    render(<DefaultsEditor {...defaultProps} />)

    expect(screen.getByDisplayValue('Default Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('open')).toBeInTheDocument()
  })

  it('should add new entry when clicking add button', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    const valueInput = screen.getByPlaceholderText('Value')

    fireEvent.change(keyInput, { target: { value: 'new_key' } })
    fireEvent.change(valueInput, { target: { value: 'new_value' } })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onChange).toHaveBeenCalledWith({ new_key: 'new_value' })
  })

  it('should add entry on Enter key press in key input', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    const valueInput = screen.getByPlaceholderText('Value')

    fireEvent.change(keyInput, { target: { value: 'test_key' } })
    fireEvent.change(valueInput, { target: { value: 'test_value' } })
    fireEvent.keyDown(keyInput, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith({ test_key: 'test_value' })
  })

  it('should add entry on Enter key press in value input', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    const valueInput = screen.getByPlaceholderText('Value')

    fireEvent.change(keyInput, { target: { value: 'test_key' } })
    fireEvent.change(valueInput, { target: { value: 'test_value' } })
    fireEvent.keyDown(valueInput, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith({ test_key: 'test_value' })
  })

  it('should clear inputs after adding entry', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    const valueInput = screen.getByPlaceholderText('Value')

    fireEvent.change(keyInput, { target: { value: 'test_key' } })
    fireEvent.change(valueInput, { target: { value: 'test_value' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(keyInput).toHaveValue('')
    expect(valueInput).toHaveValue('')
  })

  it('should disable add button when key is empty', () => {
    render(<DefaultsEditor {...defaultProps} />)

    const addButton = screen.getByRole('button', { name: 'Add' })
    expect(addButton).toBeDisabled()
  })

  it('should disable add button when key already exists', () => {
    render(<DefaultsEditor {...defaultProps} />)

    const keyInput = screen.getByPlaceholderText('Key')
    fireEvent.change(keyInput, { target: { value: 'title' } }) // Already exists

    const addButton = screen.getByRole('button', { name: 'Add' })
    expect(addButton).toBeDisabled()
  })

  it('should remove entry when clicking remove button', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor {...defaultProps} onChange={onChange} />)

    const removeButtons = screen.getAllByTitle('Remove')
    fireEvent.click(removeButtons[0])

    expect(onChange).toHaveBeenCalledWith({ state: 'open' })
  })

  it('should update value when input changes', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor {...defaultProps} onChange={onChange} />)

    const valueInput = screen.getByDisplayValue('Default Title')
    fireEvent.change(valueInput, { target: { value: 'New Title' } })

    expect(onChange).toHaveBeenCalledWith({
      title: 'New Title',
      state: 'open',
    })
  })

  it('should render datalist with suggested keys', () => {
    render(
      <DefaultsEditor
        value={{}}
        onChange={() => {}}
        suggestedKeys={['author', 'version', 'license']}
      />
    )

    const datalist = document.getElementById('suggested-keys')
    expect(datalist).toBeInTheDocument()
    expect(datalist?.querySelectorAll('option')).toHaveLength(3)
  })

  it('should filter out used keys from suggested keys', () => {
    render(
      <DefaultsEditor
        value={{ author: 'John' }}
        onChange={() => {}}
        suggestedKeys={['author', 'version', 'license']}
      />
    )

    const datalist = document.getElementById('suggested-keys')
    expect(datalist?.querySelectorAll('option')).toHaveLength(2)
  })

  it('should not render datalist when no suggested keys provided', () => {
    render(<DefaultsEditor value={{}} onChange={() => {}} />)

    const datalist = document.getElementById('suggested-keys')
    expect(datalist).not.toBeInTheDocument()
  })

  it('should not render datalist when all suggested keys are used', () => {
    render(
      <DefaultsEditor
        value={{ author: 'John', version: '1.0' }}
        onChange={() => {}}
        suggestedKeys={['author', 'version']}
      />
    )

    const datalist = document.getElementById('suggested-keys')
    expect(datalist).not.toBeInTheDocument()
  })

  it('should trim key before adding', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    fireEvent.change(keyInput, { target: { value: '  spaced_key  ' } })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onChange).toHaveBeenCalledWith({ spaced_key: '' })
  })

  it('should allow adding entry with empty value', () => {
    const onChange = vi.fn()
    render(<DefaultsEditor value={{}} onChange={onChange} />)

    const keyInput = screen.getByPlaceholderText('Key')
    fireEvent.change(keyInput, { target: { value: 'empty_value_key' } })

    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onChange).toHaveBeenCalledWith({ empty_value_key: '' })
  })
})
