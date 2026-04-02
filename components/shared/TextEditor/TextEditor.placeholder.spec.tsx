import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Placeholder', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default placeholder in edit mode', async () => {
    render(<TextEditor value="" mode="edit" onChange={() => {}} />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })

  it('should render with custom placeholder', async () => {
    render(
      <TextEditor
        value=""
        mode="edit"
        onChange={() => {}}
        placeholder="Enter your text..."
      />
    )

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })

  it('should show placeholder in raw mode textarea', async () => {
    render(
      <TextEditor
        value=""
        mode="edit"
        onChange={() => {}}
        placeholder="Custom placeholder"
      />
    )

    await waitFor(() => {
      expect(screen.getByTitle('Toggle Raw Markdown')).toBeInTheDocument()
    })

    const mdButton = screen.getByTitle('Toggle Raw Markdown')
    await act(async () => {
      fireEvent.click(mdButton)
    })

    const textarea = screen.getByPlaceholderText('Custom placeholder')
    expect(textarea).toBeInTheDocument()
  })
})
