import { useEffect } from 'react'
import type { Editor } from '@tiptap/react'

let mermaidModule: typeof import('mermaid') | null = null

async function getMermaid(): Promise<typeof import('mermaid')> {
  if (!mermaidModule) {
    mermaidModule = await import('mermaid')
    mermaidModule.default.initialize({ startOnLoad: false, theme: 'neutral' })
  }
  return mermaidModule
}

export function useMermaidRenderer(
  editor: Editor | null,
  isEditable: boolean,
  markdownContent: string
): void {
  useEffect(() => {
    if (!editor || isEditable) return

    const dom = editor.view.dom
    const mermaidBlocks = dom.querySelectorAll('code.language-mermaid')
    if (mermaidBlocks.length === 0) return

    const controller = new AbortController()

    void (async () => {
      const { default: mermaid } = await getMermaid()
      if (controller.signal.aborted) return

      await Promise.allSettled(
        Array.from(mermaidBlocks).map(async (codeEl, index) => {
          const pre = codeEl.parentElement
          if (!pre?.parentElement) return

          const code = codeEl.textContent
          const id = `mermaid-${index}-${Date.now()}`

          try {
            const { svg } = await mermaid.render(id, code)
            if (controller.signal.aborted) return
            const container = document.createElement('div')
            container.className = 'mermaid-diagram'
            container.innerHTML = svg
            pre.replaceWith(container)
          } catch {
            // fallback: keep as code block
          }
        })
      )
    })()

    return () => {
      controller.abort()
    }
  }, [editor, isEditable, markdownContent])
}
