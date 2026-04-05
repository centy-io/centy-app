import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { TextEditor } from '../TextEditor'

const MERMAID_MARKDOWN = '```mermaid\ngraph TD\n  A --> B\n```'
const RENDERED_SVG = '<svg id="mermaid-0"><text>diagram</text></svg>'

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: RENDERED_SVG }),
  },
}))

describe('useMermaidRenderer', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders mermaid code block as SVG diagram in display mode', async () => {
    render(
      React.createElement(TextEditor, {
        value: MERMAID_MARKDOWN,
        mode: 'display',
      })
    )

    await waitFor(() => {
      const diagram = document.querySelector('.mermaid-diagram')
      expect(diagram).toBeInTheDocument()
    })
  })

  it('does not render mermaid in edit mode', async () => {
    render(
      React.createElement(TextEditor, {
        value: MERMAID_MARKDOWN,
        mode: 'edit',
        onChange: vi.fn(),
      })
    )

    // Wait for any async rendering to settle
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(document.querySelector('.mermaid-diagram')).not.toBeInTheDocument()
  })

  it('falls back to code block when mermaid rendering fails', async () => {
    const mermaid = await import('mermaid')
    vi.mocked(mermaid.default.render).mockRejectedValueOnce(new Error())

    render(
      React.createElement(TextEditor, {
        value: MERMAID_MARKDOWN,
        mode: 'display',
      })
    )

    await waitFor(() => {
      const pre = document.querySelector('pre')
      expect(pre).toBeInTheDocument()
    })
  })

  it('does not render mermaid when there are no mermaid code blocks', async () => {
    render(
      React.createElement(TextEditor, {
        value: '```js\nconsole.log("hello")\n```',
        mode: 'display',
      })
    )

    // Wait for any async rendering to settle
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(document.querySelector('.mermaid-diagram')).not.toBeInTheDocument()
  })
})
