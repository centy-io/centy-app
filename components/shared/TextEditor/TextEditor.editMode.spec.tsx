import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Edit Mode', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render editable content', async () => {
    render(<TextEditor value="# Hello" mode="edit" onChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
    })

    const editor = document.querySelector('.text-editor')
    expect(editor).toHaveClass('text-editor--edit')
  })

  it('should show toolbar in edit mode', async () => {
    render(<TextEditor value="" mode="edit" onChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
      expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument()
      expect(screen.getByTitle('Strikethrough')).toBeInTheDocument()
      expect(screen.getByTitle('Inline Code')).toBeInTheDocument()
      expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
      expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
      expect(screen.getByTitle('Heading 3')).toBeInTheDocument()
      expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
      expect(screen.getByTitle('Numbered List')).toBeInTheDocument()
      expect(screen.getByTitle('Blockquote')).toBeInTheDocument()
      expect(screen.getByTitle('Code Block')).toBeInTheDocument()
      expect(screen.getByTitle('Add Link')).toBeInTheDocument()
      expect(screen.getByTitle('Horizontal Rule')).toBeInTheDocument()
      expect(screen.getByTitle('Toggle Raw Markdown')).toBeInTheDocument()
    })
  })

  it('should render with custom className', async () => {
    render(
      <TextEditor
        value=""
        onChange={() => {}}
        mode="edit"
        className="custom-class"
      />
    )

    await waitFor(() => {
      const editor = document.querySelector('.text-editor')
      expect(editor).toHaveClass('custom-class')
    })
  })

  it('should render with custom minHeight', async () => {
    render(
      <TextEditor value="" onChange={() => {}} mode="edit" minHeight={300} />
    )

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toHaveStyle({ minHeight: '300px' })
    })
  })
})

describe('TextEditor - Link functionality', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should open prompt when link button is clicked', async () => {
    mockPrompt.mockReturnValue(null)
    render(<TextEditor value="" mode="edit" onChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByTitle('Add Link')).toBeInTheDocument()
    })

    const linkButton = screen.getByTitle('Add Link')
    act(() => {
      fireEvent.click(linkButton)
    })

    expect(mockPrompt).toHaveBeenCalledWith('URL', undefined)
  })

  it('should add link when URL is provided', async () => {
    mockPrompt.mockReturnValue('https://example.com')
    render(<TextEditor value="" mode="edit" onChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByTitle('Add Link')).toBeInTheDocument()
    })

    const linkButton = screen.getByTitle('Add Link')
    act(() => {
      fireEvent.click(linkButton)
    })

    expect(mockPrompt).toHaveBeenCalled()
  })
})
