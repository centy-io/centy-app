import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Display Mode', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render content in readonly mode', async () => {
    render(<TextEditor value="# Hello" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })

    const editor = document.querySelector('.text-editor')
    expect(editor).toHaveClass('text-editor--display')
  })

  it('should hide toolbar in display mode', async () => {
    render(<TextEditor value="Content" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })

    expect(screen.queryByTitle('Bold (Ctrl+B)')).not.toBeInTheDocument()
  })

  it('should not require onChange in display mode', async () => {
    render(<TextEditor value="Content" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })
})

describe('TextEditor - Format Handling', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render Markdown content directly', async () => {
    render(<TextEditor value="# Heading" format="md" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })

  it('should convert AsciiDoc to Markdown', async () => {
    render(<TextEditor value="= Heading" format="adoc" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })

  it('should default to md format', async () => {
    render(<TextEditor value="# Heading" mode="display" />)

    await waitFor(() => {
      const editorContent = document.querySelector('.editor-content')
      expect(editorContent).toBeInTheDocument()
    })
  })
})

describe('TextEditor - Backward Compatibility', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should work with existing MarkdownEditor props interface', async () => {
    const onChange = vi.fn()
    render(
      <TextEditor
        value="Content"
        onChange={onChange}
        placeholder="Enter text"
        minHeight={300}
        className="custom"
      />
    )

    await waitFor(() => {
      const editor = document.querySelector('.text-editor')
      expect(editor).toBeInTheDocument()
      expect(editor).toHaveClass('custom')
    })
  })

  it('should default to edit mode when no mode specified', async () => {
    render(<TextEditor value="" onChange={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
    })
  })
})
