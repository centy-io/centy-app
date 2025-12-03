import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CustomFieldsEditor } from './CustomFieldsEditor'
import type { CustomFieldDefinition } from '../gen/centy_pb.ts'

describe('CustomFieldsEditor', () => {
  const createField = (
    name: string,
    fieldType = 'string',
    options: Partial<CustomFieldDefinition> = {}
  ): CustomFieldDefinition => ({
    name,
    fieldType,
    required: false,
    defaultValue: '',
    enumValues: [],
    $typeName: 'centy.CustomFieldDefinition',
    ...options,
  })

  const defaultProps = {
    fields: [
      createField('assignee'),
      createField('priority', 'number'),
      createField('status', 'enum', { enumValues: ['open', 'closed'] }),
    ],
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state when no fields', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    expect(screen.getByText('No custom fields configured')).toBeInTheDocument()
  })

  it('should render all fields', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    expect(screen.getByText('assignee')).toBeInTheDocument()
    expect(screen.getByText('priority')).toBeInTheDocument()
    expect(screen.getByText('status')).toBeInTheDocument()
  })

  it('should display field types correctly', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
    expect(screen.getByText('Select (Enum)')).toBeInTheDocument()
  })

  it('should show add field button', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: '+ Add Custom Field' })
    ).toBeInTheDocument()
  })

  it('should open add form when clicking add button', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    expect(screen.getByPlaceholderText('field_name')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Field' })
    ).toBeInTheDocument()
  })

  it('should add new field when form is submitted', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor fields={[]} onChange={onChange} />)

    // Open form
    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    // Fill in name
    const nameInput = screen.getByPlaceholderText('field_name')
    fireEvent.change(nameInput, { target: { value: 'new_field' } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Add Field' }))

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'new_field',
        fieldType: 'string',
      }),
    ])
  })

  it('should cancel adding when cancel button is clicked', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByPlaceholderText('field_name')).not.toBeInTheDocument()
  })

  it('should remove field when remove button is clicked', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor {...defaultProps} onChange={onChange} />)

    const removeButtons = screen.getAllByRole('button', { name: '×' })
    fireEvent.click(removeButtons[0])

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'priority' }),
      expect.objectContaining({ name: 'status' }),
    ])
  })

  it('should open edit form when edit button is clicked', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    const nameInput = screen.getByDisplayValue('assignee')
    expect(nameInput).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Update Field' })
    ).toBeInTheDocument()
  })

  it('should update field when edit form is submitted', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor {...defaultProps} onChange={onChange} />)

    // Open edit form
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    // Change name
    const nameInput = screen.getByDisplayValue('assignee')
    fireEvent.change(nameInput, { target: { value: 'owner' } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Update Field' }))

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'owner' }),
      expect.objectContaining({ name: 'priority' }),
      expect.objectContaining({ name: 'status' }),
    ])
  })

  it('should cancel editing when cancel button is clicked', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByDisplayValue('assignee')).not.toBeInTheDocument()
  })

  it('should move field up when move up button is clicked', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor {...defaultProps} onChange={onChange} />)

    const moveUpButtons = screen.getAllByTitle('Move up')
    fireEvent.click(moveUpButtons[1]) // Move second field up

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'priority' }),
      expect.objectContaining({ name: 'assignee' }),
      expect.objectContaining({ name: 'status' }),
    ])
  })

  it('should move field down when move down button is clicked', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor {...defaultProps} onChange={onChange} />)

    const moveDownButtons = screen.getAllByTitle('Move down')
    fireEvent.click(moveDownButtons[0]) // Move first field down

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'priority' }),
      expect.objectContaining({ name: 'assignee' }),
      expect.objectContaining({ name: 'status' }),
    ])
  })

  it('should disable move up button for first field', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    const moveUpButtons = screen.getAllByTitle('Move up')
    expect(moveUpButtons[0]).toBeDisabled()
  })

  it('should disable move down button for last field', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    const moveDownButtons = screen.getAllByTitle('Move down')
    expect(moveDownButtons[moveDownButtons.length - 1]).toBeDisabled()
  })

  it('should show required indicator for required fields', () => {
    const fields = [createField('test', 'string', { required: true })]
    render(<CustomFieldsEditor fields={fields} onChange={() => {}} />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should show default value when field has one', () => {
    const fields = [
      createField('test', 'string', { defaultValue: 'default_value' }),
    ]
    render(<CustomFieldsEditor fields={fields} onChange={() => {}} />)

    expect(screen.getByText('default_value')).toBeInTheDocument()
  })

  it('should show enum options for enum fields', () => {
    render(<CustomFieldsEditor {...defaultProps} />)

    // Enum values are rendered inside code tags in the details section
    const optionsText = screen.getByText(/Options:/)
    expect(optionsText).toBeInTheDocument()
    expect(optionsText.parentElement).toHaveTextContent('open')
    expect(optionsText.parentElement).toHaveTextContent('closed')
  })

  it('should show enum section when editing enum type field', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    // Open form and change type to enum
    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const typeSelect = screen.getByRole('combobox')
    fireEvent.change(typeSelect, { target: { value: 'enum' } })

    expect(screen.getByText('Options')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add option...')).toBeInTheDocument()
  })

  it('should add enum option when clicking add button', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const typeSelect = screen.getByRole('combobox')
    fireEvent.change(typeSelect, { target: { value: 'enum' } })

    const optionInput = screen.getByPlaceholderText('Add option...')
    fireEvent.change(optionInput, { target: { value: 'opt_click' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    // Check the enum tag exists in the list
    const enumTags = document.querySelectorAll('.custom-field-enum-tag')
    expect(enumTags).toHaveLength(1)
    expect(enumTags[0]).toHaveTextContent('opt_click')
  })

  it('should add enum option on Enter key press', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const typeSelect = screen.getByRole('combobox')
    fireEvent.change(typeSelect, { target: { value: 'enum' } })

    const optionInput = screen.getByPlaceholderText('Add option...')
    fireEvent.change(optionInput, { target: { value: 'new_opt' } })
    fireEvent.keyDown(optionInput, { key: 'Enter' })

    // Check the enum tag exists in the list
    const enumTags = document.querySelectorAll('.custom-field-enum-tag')
    expect(enumTags).toHaveLength(1)
    expect(enumTags[0]).toHaveTextContent('new_opt')
  })

  it('should not allow duplicate field names', () => {
    const fields = [createField('existing_field')]
    render(<CustomFieldsEditor fields={fields} onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const nameInput = screen.getByPlaceholderText('field_name')
    fireEvent.change(nameInput, { target: { value: 'existing_field' } }) // Already exists

    const addButton = screen.getByRole('button', { name: 'Add Field' })
    expect(addButton).toBeDisabled()
  })

  it('should require at least one enum option for enum fields', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const nameInput = screen.getByPlaceholderText('field_name')
    fireEvent.change(nameInput, { target: { value: 'test_enum' } })

    const typeSelect = screen.getByRole('combobox')
    fireEvent.change(typeSelect, { target: { value: 'enum' } })

    const addButton = screen.getByRole('button', { name: 'Add Field' })
    expect(addButton).toBeDisabled() // No enum options yet
  })

  it('should show boolean default value options', () => {
    render(<CustomFieldsEditor fields={[]} onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    fireEvent.change(typeSelect, { target: { value: 'boolean' } })

    // After changing to boolean, there should be 2 selects: type and default value
    const updatedSelects = screen.getAllByRole('combobox')
    const defaultSelect = updatedSelects[1]
    expect(defaultSelect).toBeInTheDocument()

    // Check options
    const options = defaultSelect.querySelectorAll('option')
    expect(options).toHaveLength(3) // No default, True, False
  })

  it('should toggle required checkbox', () => {
    const onChange = vi.fn()
    render(<CustomFieldsEditor fields={[]} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: '+ Add Custom Field' }))

    const nameInput = screen.getByPlaceholderText('field_name')
    fireEvent.change(nameInput, { target: { value: 'test' } })

    const requiredCheckbox = screen.getByRole('checkbox')
    fireEvent.click(requiredCheckbox)

    fireEvent.click(screen.getByRole('button', { name: 'Add Field' }))

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'test',
        required: true,
      }),
    ])
  })
})
