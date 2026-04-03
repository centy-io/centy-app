import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Raw mode toggle', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should toggle to raw mode when MD button is clicked', async () => {
    render(<TextEditor value="Some content" mode="edit" onChange={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByTitle('Toggle Raw Markdown')).toBeInTheDocument()
    })

    const mdButton = screen.getByTitle('Toggle Raw Markdown')
    expect(mdButton).toHaveTextContent('MD')

    await act(async () => {
      fireEvent.click(mdButton)
    })

    expect(mdButton).toHaveTextContent('WYSIWYG')
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should show textarea in raw mode', async () => {
    render(<TextEditor value="Test content" mode="edit" onChange={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByTitle('Toggle Raw Markdown')).toBeInTheDocument()
    })

    const mdButton = screen.getByTitle('Toggle Raw Markdown')

    await act(async () => {
      fireEvent.click(mdButton)
    })

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('editor-raw')
  })

  it('should update value when typing in raw mode', async () => {
    const onChange = vi.fn()
    render(<TextEditor value="" mode="edit" onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByTitle('Toggle Raw Markdown')).toBeInTheDocument()
    })

    const mdButton = screen.getByTitle('Toggle Raw Markdown')
    await act(async () => {
      fireEvent.click(mdButton)
    })

    const textarea = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(textarea, { target: { value: '# New content' } })
    })

    expect(onChange).toHaveBeenCalledWith('# New content')
  })
})
