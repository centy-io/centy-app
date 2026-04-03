import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Mode Toggle', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should show toggle button when allowModeToggle is true', async () => {
    render(<TextEditor value="Content" mode="display" allowModeToggle={true} />)

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

    act(() => {
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
