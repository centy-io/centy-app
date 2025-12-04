import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

// Mock window.prompt for link tests
const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Display Mode', () => {
    it('should render content in readonly mode', async () => {
      render(<TextEditor value="# Hello" mode="display" />)

      await waitFor(() => {
        const editorContent = document.querySelector('.editor-content')
        expect(editorContent).toBeInTheDocument()
      })

      // Should have display class
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
      // Should not throw
      render(<TextEditor value="Content" mode="display" />)

      await waitFor(() => {
        const editorContent = document.querySelector('.editor-content')
        expect(editorContent).toBeInTheDocument()
      })
    })
  })

  describe('Edit Mode', () => {
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

  describe('Mode Toggle', () => {
    it('should show toggle button when allowModeToggle is true', async () => {
      render(
        <TextEditor value="Content" mode="display" allowModeToggle={true} />
      )

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument()
      })
    })

    it('should not show toggle button when allowModeToggle is false', async () => {
      render(
        <TextEditor value="Content" mode="display" allowModeToggle={false} />
      )

      await waitFor(() => {
        const editorContent = document.querySelector('.editor-content')
        expect(editorContent).toBeInTheDocument()
      })

      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })

    it('should toggle between display and edit modes', async () => {
      const onModeChange = vi.fn()
      render(
        <TextEditor
          value="Content"
          mode="display"
          allowModeToggle={true}
          onModeChange={onModeChange}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.click(screen.getByText('Edit'))
      })

      expect(onModeChange).toHaveBeenCalledWith('edit')
    })

    it('should show View button when in edit mode with toggle enabled', async () => {
      render(
        <TextEditor
          value="Content"
          onChange={() => {}}
          mode="edit"
          allowModeToggle={true}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('View')).toBeInTheDocument()
      })
    })
  })

  describe('Format Handling', () => {
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

  describe('Raw mode toggle', () => {
    it('should toggle to raw mode when MD button is clicked', async () => {
      render(
        <TextEditor value="Some content" mode="edit" onChange={() => {}} />
      )

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
      render(
        <TextEditor value="Test content" mode="edit" onChange={() => {}} />
      )

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

      // Switch to raw mode
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

  describe('Toolbar buttons', () => {
    it('should click bold button', async () => {
      render(<TextEditor value="" mode="edit" onChange={() => {}} />)

      await waitFor(() => {
        expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
      })

      const boldButton = screen.getByTitle('Bold (Ctrl+B)')
      await act(async () => {
        fireEvent.click(boldButton)
      })

      expect(boldButton).toBeInTheDocument()
    })

    it('should click italic button', async () => {
      render(<TextEditor value="" mode="edit" onChange={() => {}} />)

      await waitFor(() => {
        expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument()
      })

      const italicButton = screen.getByTitle('Italic (Ctrl+I)')
      await act(async () => {
        fireEvent.click(italicButton)
      })

      expect(italicButton).toBeInTheDocument()
    })

    it('should click heading buttons', async () => {
      render(<TextEditor value="" mode="edit" onChange={() => {}} />)

      await waitFor(() => {
        expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
      })

      const h1Button = screen.getByTitle('Heading 1')
      const h2Button = screen.getByTitle('Heading 2')
      const h3Button = screen.getByTitle('Heading 3')

      await act(async () => {
        fireEvent.click(h1Button)
      })
      expect(h1Button).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(h2Button)
      })
      expect(h2Button).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(h3Button)
      })
      expect(h3Button).toBeInTheDocument()
    })

    it('should click list buttons', async () => {
      render(<TextEditor value="" mode="edit" onChange={() => {}} />)

      await waitFor(() => {
        expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
      })

      const bulletListButton = screen.getByTitle('Bullet List')
      const orderedListButton = screen.getByTitle('Numbered List')

      await act(async () => {
        fireEvent.click(bulletListButton)
      })
      expect(bulletListButton).toBeInTheDocument()

      await act(async () => {
        fireEvent.click(orderedListButton)
      })
      expect(orderedListButton).toBeInTheDocument()
    })
  })

  describe('Link functionality', () => {
    it('should open prompt when link button is clicked', async () => {
      mockPrompt.mockReturnValue(null) // User cancels
      render(<TextEditor value="" mode="edit" onChange={() => {}} />)

      await waitFor(() => {
        expect(screen.getByTitle('Add Link')).toBeInTheDocument()
      })

      const linkButton = screen.getByTitle('Add Link')
      await act(async () => {
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
      await act(async () => {
        fireEvent.click(linkButton)
      })

      expect(mockPrompt).toHaveBeenCalled()
    })
  })

  describe('Placeholder', () => {
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

  describe('Backward Compatibility', () => {
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
      render(<TextEditor value="" onChange={() => {}} />)

      await waitFor(() => {
        // Should show toolbar (edit mode default)
        expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
      })
    })
  })
})
