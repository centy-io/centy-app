import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TextEditor } from './TextEditor'

const mockPrompt = vi.fn()
window.prompt = mockPrompt

describe('TextEditor - Toolbar buttons', () => {
  beforeEach(() => {
    mockPrompt.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should click bold button', async () => {
    render(<TextEditor value="" mode="edit" onChange={vi.fn()} />)

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
    render(<TextEditor value="" mode="edit" onChange={vi.fn()} />)

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
    render(<TextEditor value="" mode="edit" onChange={vi.fn()} />)

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
    render(<TextEditor value="" mode="edit" onChange={vi.fn()} />)

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
